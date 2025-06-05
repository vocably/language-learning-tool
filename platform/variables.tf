variable "root_domain" {
  type = string
}

variable "gcloud_project_id" {
  type = string
}

variable "google_oauth2_client_id" {
  type = string
}

variable "google_oauth2_client_secret" {
  type = string
}

variable "apple_sign_in_service_id" {
  type = string
}

variable "apple_team_id" {
  type = string
}

variable "apple_sign_in_key_id" {
  type      = string
  sensitive = true
}

variable "apple_sign_in_key" {
  type      = string
  sensitive = true
}

variable "lexicala_host" {
  type = string
}

variable "lexicala_key" {
  type = string
}

variable "nlp_translation_host" {
  type = string
}

variable "nlp_translation_key" {
  type = string
}

variable "extension_name" {
  type = string
}

variable "extension_key" {
  type = string
}

variable "extension_content_script_excluded_matches" {
  type = string
}

variable "extension_externally_connectable_matches" {
  type = string
}

variable "extension_extra_permissions" {
  type = string
}

variable "extension_host_permissions" {
  type = string
}

variable "extension_auto_reload" {
  type = string
}

variable "chrome_extension_id" {
  type = string
}

variable "safari_extension_id" {
  type    = string
  default = "pro.vocably.Vocably.Extension (789D8NRAM6)"
}

variable "ios_safari_extension_id" {
  type    = string
  default = "pro.vocably.app.Vocably-for-Safari (789D8NRAM6)"
}

variable "sentry_environment" {
  type = string
}

variable "piwik_app_id" {
  type = string
}

variable "piwik_www_id" {
  type = string
}

variable "alarm_email" {
  type = string
}

variable "test_user_username" {
  type    = string
  default = "test_dev"
}

variable "test_user_email" {
  type    = string
  default = "test_dev@vocably.pro"
}

variable "test_user_password" {
  type = string
}

variable "endtest_app_id" {
  type    = string
  default = "51386087"
}

variable "endtest_app_code" {
  type = string
}

variable "endtest_latest_env_suite" {
  type = string
}

variable "brevo_api_key" {
  type      = string
  sensitive = true
}

variable "openai_api_key" {
  type      = string
  sensitive = true
}

variable "revenue_cat_auth_header" {
  type      = string
  sensitive = true
}
