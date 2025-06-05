resource "aws_iam_role" "revenue_cat_webhook_lambda" {
  name               = "vocably-${terraform.workspace}-revenue-cat-webhook-lambda"
  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}

resource "aws_iam_policy" "revenue_cat_webhook_logs" {
  name = "vocably-${terraform.workspace}-revenue-cat-webhook-lambda-logs-policy"
  policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        "Sid" : "DefaultLogging",
        "Effect" : "Allow",
        "Action" : [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ],
        "Resource" : "*"
      },
      {
        "Sid" : "Cognito",
        "Effect" : "Allow",
        "Action" : [
          "cognito-idp:ListUsers",
        ],
        "Resource" : "*"
      },
      {
        "Sid" : "S3StaticUserFiles",
        "Effect" : "Allow",
        "Action" : [
          "s3:*",
        ],
        "Resource" : [
          aws_s3_bucket.user_static_files.arn,
          "${aws_s3_bucket.user_static_files.arn}/*",
        ]
      },
    ]
  })
}

resource "aws_iam_role_policy_attachment" "revenue_cat_webhook_lambda_logging" {
  role       = aws_iam_role.revenue_cat_webhook_lambda.name
  policy_arn = aws_iam_policy.revenue_cat_webhook_logs.arn
}

data "external" "www_backend_build" {
  depends_on = [local_file.www_backend_environment]
  program = ["bash", "-c", <<EOT
(NODE_OPTIONS=--max-old-space-size=1024 npm run build --loglevel verbose) >&2 && echo "{\"dest\": \"dist\"}"
EOT
  ]
  working_dir = local.www_backed_root
}

data "archive_file" "www_backend_build" {
  depends_on = [
    data.external.www_backend_build
  ]
  type        = "zip"
  source_dir  = "${data.external.www_backend_build.working_dir}/${data.external.www_backend_build.result.dest}"
  output_path = "www_backend_build.zip"
}

resource "aws_lambda_function" "revenue_cat_webhook" {
  filename         = data.archive_file.www_backend_build.output_path
  function_name    = "vocably-${terraform.workspace}-revenue-cat-webhook"
  role             = aws_iam_role.revenue_cat_webhook_lambda.arn
  handler          = "revenueCatWebhook.revenueCatWebhook"
  source_code_hash = data.archive_file.www_backend_build.output_base64sha256
  runtime          = "nodejs18.x"
}

resource "aws_cloudwatch_log_group" "revenue_cat_webhook" {
  name              = "/aws/lambda/${aws_lambda_function.revenue_cat_webhook.function_name}"
  retention_in_days = 14
}

resource "aws_apigatewayv2_api" "www_api" {
  name          = "vocably-${terraform.workspace}-www-api"
  protocol_type = "HTTP"

  cors_configuration {
    allow_credentials = true
    allow_headers     = ["*"]
    allow_methods     = ["*"]
    allow_origins     = ["https://*", "http://*"]
  }
}

resource "aws_apigatewayv2_stage" "www_api" {
  api_id = aws_apigatewayv2_api.www_api.id

  name        = "v1"
  auto_deploy = true

  access_log_settings {
    destination_arn = aws_cloudwatch_log_group.api_gw.arn

    format = jsonencode({
      requestId               = "$context.requestId"
      sourceIp                = "$context.identity.sourceIp"
      requestTime             = "$context.requestTime"
      protocol                = "$context.protocol"
      httpMethod              = "$context.httpMethod"
      resourcePath            = "$context.resourcePath"
      routeKey                = "$context.routeKey"
      status                  = "$context.status"
      responseLength          = "$context.responseLength"
      integrationErrorMessage = "$context.integrationErrorMessage"
      }
    )
  }
}

resource "aws_apigatewayv2_integration" "revenue_cat_webhook" {
  api_id = aws_apigatewayv2_api.www_api.id

  integration_uri    = aws_lambda_function.revenue_cat_webhook.invoke_arn
  integration_type   = "AWS_PROXY"
  integration_method = "POST"
}

resource "aws_apigatewayv2_route" "revenue_cat_webhook" {
  api_id = aws_apigatewayv2_api.www_api.id

  route_key = "POST /revenue-cat"
  target    = "integrations/${aws_apigatewayv2_integration.revenue_cat_webhook.id}"
}

resource "aws_cloudwatch_log_group" "api_gw" {
  name = "/aws/api_gw/${aws_apigatewayv2_api.www_api.name}"

  retention_in_days = 30
}

resource "aws_lambda_permission" "www_api" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.revenue_cat_webhook.function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "${aws_apigatewayv2_api.www_api.execution_arn}/*/*"
}

resource "aws_apigatewayv2_domain_name" "www_api" {
  domain_name = local.www_api_domain
  domain_name_configuration {
    certificate_arn = aws_acm_certificate.primary.arn
    endpoint_type   = "REGIONAL"
    security_policy = "TLS_1_2"
  }
  depends_on = [aws_acm_certificate_validation.primary]
}

resource "aws_route53_record" "www_api" {
  name    = aws_apigatewayv2_domain_name.www_api.domain_name
  type    = "A"
  zone_id = data.aws_route53_zone.primary.id

  alias {
    evaluate_target_health = true
    name                   = aws_apigatewayv2_domain_name.www_api.domain_name_configuration[0].target_domain_name
    zone_id                = aws_apigatewayv2_domain_name.www_api.domain_name_configuration[0].hosted_zone_id
  }
}

resource "aws_apigatewayv2_api_mapping" "www_api" {
  api_id      = aws_apigatewayv2_api.www_api.id
  stage       = aws_apigatewayv2_stage.www_api.name
  domain_name = aws_apigatewayv2_domain_name.www_api.domain_name
}

output "www_api_url" {
  value = "https://${aws_apigatewayv2_domain_name.www_api.domain_name}"
}
