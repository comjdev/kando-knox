// CloudFront Function: Rewrite directory URLs to index.html
// S3 REST API doesn't support directory indexes - /about/ must become /about/index.html
// This enables Astro's static site routing (each route = folder/index.html)
//
// NOTE: This logic is now COMBINED into www-to-apex-redirect-with-legacy.js
// (and www-to-apex-redirect.js) because CloudFront allows only 1 viewer-request function.
// Kept here as reference.

function handler(event) {
  var request = event.request;
  var uri = request.uri;

  // Handle root - DefaultRootObject handles this, but be explicit
  if (uri === "/" || uri === "") {
    request.uri = "/index.html";
    return request;
  }

  // Path ends with / → append index.html (e.g. /about/ → /about/index.html)
  if (uri.endsWith("/")) {
    request.uri = uri + "index.html";
    return request;
  }

  // Path has no file extension → treat as directory, add /index.html
  // e.g. /about → /about/index.html, /blog/my-post → /blog/my-post/index.html
  // Skip if it looks like a file (has extension like .css, .js, .png)
  var pathParts = uri.split("/");
  var lastSegment = pathParts[pathParts.length - 1];
  if (!lastSegment.includes(".")) {
    request.uri = uri + "/index.html";
  }

  return request;
}
