// Serves the Angular app (which lives at the root of its own bucket) under the
// ${app_path} path of the www distribution.
var PREFIX = '/${app_path}';

function handler(event) {
  var request = event.request;
  var uri = request.uri;

  // The app is built with <base href="/${app_path}/">, so the trailing slash matters:
  // without it every relative asset would resolve against the www root.
  if (uri === PREFIX) {
    return {
      statusCode: 301,
      statusDescription: 'Moved Permanently',
      headers: {
        location: { value: PREFIX + '/' },
      },
    };
  }

  uri = uri.substring(PREFIX.length);

  // Everything that isn't a file is an Angular route, so hand it the SPA shell.
  // The distribution-wide custom_error_response points at the www index.html,
  // which would be the wrong shell for app routes.
  var lastSegment = uri.substring(uri.lastIndexOf('/') + 1);
  if (lastSegment.indexOf('.') === -1 && uri.indexOf('/.well-known/') !== 0) {
    uri = '/index.html';
  }

  request.uri = uri;

  return request;
}
