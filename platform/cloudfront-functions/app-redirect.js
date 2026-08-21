// ${app_domain} is retired in favour of ${app_url}. Everything that still hits
// the old host is redirected, keeping the path and the query string so that
// deep links and OAuth callbacks survive the hop.
var TARGET = '${app_url}';

function handler(event) {
  var request = event.request;
  var location = TARGET + request.uri;

  var query = [];
  for (var name in request.querystring) {
    var parameter = request.querystring[name];

    if (parameter.multiValue) {
      for (var i = 0; i < parameter.multiValue.length; i++) {
        query.push(name + '=' + parameter.multiValue[i].value);
      }
    } else {
      query.push(name + '=' + parameter.value);
    }
  }

  if (query.length > 0) {
    location = location + '?' + query.join('&');
  }

  return {
    statusCode: 301,
    statusDescription: 'Moved Permanently',
    headers: {
      location: { value: location },
    },
  };
}
