locals {
  auth_domain                      = "auth.${var.root_domain}"
  app_domain                       = "app.${var.root_domain}"
  api_domain                       = "api.${var.root_domain}"
  www_api_domain                   = "www-api.${var.root_domain}"
  app_root                         = abspath("../packages/app")
  extension_root                   = abspath("../packages/extension")
  analyze_root                     = abspath("../packages/analyze")
  backend_root                     = abspath("../packages/backend")
  auth_lambdas_root                = abspath("../packages/auth-lambdas")
  www_root                         = abspath("../packages/www")
  e2e_www_root                     = abspath("../packages/e2e-www")
  www_backed_root                  = abspath("../packages/www-backend")
  artifacts_root                   = abspath("../packages/artifacts")
  extension_popup_root             = abspath("../packages/extension-popup")
  scripts_root                     = abspath("../scripts")
  auto_sign_in_confirmation_path   = "signed-in"
  manual_sign_in_confirmation_path = "portal"
  www_base_url                     = "https://${var.root_domain}"
  dev_urls = [
    "http://localhost:8030",
    "http://localhost:8030/${local.auto_sign_in_confirmation_path}",
    "http://localhost:8030/${local.manual_sign_in_confirmation_path}",
    "https://oauth.pstmn.io/v1/callback"
  ]
}

locals {
  mime_types = {
    htm  = "text/html"
    html = "text/html"
    xml  = "text/xml"
    css  = "text/css"
    ttf  = "font/ttf"
    js   = "application/javascript"
    map  = "application/javascript"
    json = "application/json"
    jpg  = "image/jpeg"
    ico  = "image/x-icon"
    txt  = "text/plain"
    svg  = "image/svg+xml"
    mp4  = "video/mp4"
    png  = "image/png"
  }
}
