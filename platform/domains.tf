data "aws_route53_zone" "primary" {
  name = var.root_domain
}

resource "aws_acm_certificate" "primary-global" {
  domain_name               = "*.${data.aws_route53_zone.primary.name}"
  subject_alternative_names = [data.aws_route53_zone.primary.name]
  validation_method         = "DNS"
  provider                  = aws.global
  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_route53_record" "primary-global" {
  for_each = {
    for dvo in aws_acm_certificate.primary-global.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  }

  allow_overwrite = true
  name            = each.value.name
  records         = [each.value.record]
  ttl             = 60
  type            = each.value.type
  zone_id         = data.aws_route53_zone.primary.zone_id
}

resource "aws_acm_certificate_validation" "primary-global" {
  provider                = aws.global
  certificate_arn         = aws_acm_certificate.primary-global.arn
  validation_record_fqdns = [for record in aws_route53_record.primary-global : record.fqdn]
}


resource "aws_acm_certificate" "primary" {
  domain_name               = "*.${data.aws_route53_zone.primary.name}"
  subject_alternative_names = [data.aws_route53_zone.primary.name]
  validation_method         = "DNS"
}

resource "aws_route53_record" "primary" {
  for_each = {
    for dvo in aws_acm_certificate.primary.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  }

  allow_overwrite = true
  name            = each.value.name
  records         = [each.value.record]
  ttl             = 60
  type            = each.value.type
  zone_id         = data.aws_route53_zone.primary.zone_id
}

resource "aws_acm_certificate_validation" "primary" {
  certificate_arn         = aws_acm_certificate.primary.arn
  validation_record_fqdns = [for record in aws_route53_record.primary : record.fqdn]
}
