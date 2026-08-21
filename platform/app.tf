locals {
  app_bucket = "vocably-${terraform.workspace}-app"

  # The bucket below is still the app's origin, but it is now reached through
  # the www distribution under /app rather than through app.vocably.pro.
  app_url = "${local.www_base_url}/${local.app_path}"

  # app.vocably.pro only redirects to local.app_url now, but old extension
  # builds and bookmarks still point at it.
  legacy_app_url = "https://${local.app_domain}"
}

resource "aws_s3_bucket" "app" {
  bucket = local.app_bucket

  force_destroy = true
}

resource "aws_s3_bucket_acl" "app" {
  bucket = aws_s3_bucket.app.bucket

  acl = "public-read"
}

resource "aws_s3_bucket_policy" "app" {
  bucket = aws_s3_bucket.app.bucket

  policy = <<EOF
{
  "Version":"2012-10-17",
  "Statement":[{
        "Sid":"PublicReadForGetBucketObjects",
        "Effect":"Allow",
          "Principal": "*",
      "Action":["s3:GetObject"],
      "Resource":["arn:aws:s3:::${local.app_bucket}/*"]
    }
  ]
}
EOF
}

resource "aws_s3_bucket_versioning" "app" {
  bucket = aws_s3_bucket.app.bucket

  versioning_configuration {
    status = "Suspended"
  }
}

resource "aws_s3_bucket_website_configuration" "app" {
  bucket = aws_s3_bucket.app.bucket

  index_document {
    suffix = "index.html"
  }
  error_document {
    key = "index.html"
  }
}

resource "aws_cloudfront_origin_access_identity" "app" {
  comment = "${local.app_bucket}-cloudfront-origin-access-identity"
}

resource "aws_cloudfront_function" "app_redirect" {
  name    = "vocably-${terraform.workspace}-app-redirect"
  runtime = "cloudfront-js-2.0"
  comment = "Redirects ${local.app_domain} to ${local.app_url}"
  publish = true

  code = templatefile("${path.module}/cloudfront-functions/app-redirect.js", {
    app_url    = local.app_url
    app_domain = local.app_domain
  })
}

resource "aws_cloudfront_distribution" "app" {
  origin {
    domain_name = aws_s3_bucket.app.bucket_regional_domain_name
    origin_id   = aws_s3_bucket.app.bucket_regional_domain_name

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.app.cloudfront_access_identity_path
    }
  }

  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"

  aliases = [local.app_domain]

  default_cache_behavior {
    allowed_methods        = ["HEAD", "GET"]
    cached_methods         = ["HEAD", "GET"]
    target_origin_id       = aws_s3_bucket.app.bucket_regional_domain_name
    viewer_protocol_policy = "redirect-to-https"

    # Viewer-request functions run on every request and their responses are not
    # cached, so this distribution never reaches its origin any more.
    function_association {
      event_type   = "viewer-request"
      function_arn = aws_cloudfront_function.app_redirect.arn
    }

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }
  }

  viewer_certificate {
    acm_certificate_arn = aws_acm_certificate.primary-global.arn
    ssl_support_method  = "sni-only"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  custom_error_response {
    error_code         = 404
    response_code      = 200
    response_page_path = "/index.html"
  }

  custom_error_response {
    error_code         = 403
    response_code      = 200
    response_page_path = "/index.html"
  }

  depends_on = [aws_acm_certificate_validation.primary-global]
}

resource "aws_route53_record" "app" {
  zone_id = data.aws_route53_zone.primary.zone_id
  name    = local.app_domain
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.app.domain_name
    zone_id                = aws_cloudfront_distribution.app.hosted_zone_id
    evaluate_target_health = false
  }
}

data "external" "app_build" {
  depends_on = [local_file.app_environment]
  program = ["bash", "-lc", <<EOT
(NODE_OPTIONS=--max-old-space-size=1024 npm run build --loglevel verbose) >&2 && echo "{\"dest\": \"$(pwd)/dist\"}"
EOT
  ]
  working_dir = local.app_root
}

locals {
  app_dist = data.external.app_build.result.dest
}

resource "null_resource" "app_upload" {
  depends_on = [
    data.external.app_build,
    aws_s3_bucket.app,
  ]

  triggers = {
    sha1 = sha1(join("", [for f in fileset(local.app_dist, "**/*.*") : filesha1("${local.app_dist}/${f}")]))
  }

  provisioner "local-exec" {
    command = "aws s3 sync ${local.app_dist}  s3://${aws_s3_bucket.app.id} --delete"
  }
}

output "app_url" {
  value = local.app_url
}
