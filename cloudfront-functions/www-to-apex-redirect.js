// CloudFront Function: www → apex + academy + index-document (PERMANENT)
// Deploy when legacy redirects removed. Combined so only 1 viewer-request function needed.
//
// Handles:
// 1. www → apex (301)
// 2. /academy → external URL (301)
// 3. Index document: /about → /about/index.html for S3

var ACADEMY_URL = "https://cf.knoxmartialarts.com.au/membership-area";

function handler(event) {
  var request = event.request;
  var headers = request.headers;
  var host = headers.host && headers.host.value ? headers.host.value : "";
  var uri = request.uri || "/";

  function buildRedirect(url) {
    return {
      statusCode: 301,
      statusDescription: "Moved Permanently",
      headers: { location: { value: url } },
    };
  }

  // 1. Redirect www to apex
  if (host.startsWith("www.")) {
    var apex = host.replace(/^www\./, "");
    var qs = "";
    if (request.querystring && Object.keys(request.querystring).length > 0) {
      var parts = [];
      for (var key in request.querystring) {
        var param = request.querystring[key];
        var val = param.multiValue ? param.multiValue[0].value : (param.value || "");
        parts.push(encodeURIComponent(key) + "=" + encodeURIComponent(val));
      }
      qs = "?" + parts.join("&");
    }
    return buildRedirect("https://" + apex + uri + qs);
  }

  // 2. Redirect /academy to external URL
  var pathNorm = uri.replace(/\/$/, "") || "/";
  if (pathNorm === "/academy") {
    return buildRedirect(ACADEMY_URL);
  }

  // 3. Index document: rewrite for S3 (no directory indexes)
  if (uri === "/" || uri === "") {
    request.uri = "/index.html";
  } else if (uri.endsWith("/")) {
    request.uri = uri + "index.html";
  } else {
    var pathParts = uri.split("/");
    var lastSegment = pathParts[pathParts.length - 1];
    if (!lastSegment.includes(".")) {
      request.uri = uri + "/index.html";
    }
  }

  return request;
}
