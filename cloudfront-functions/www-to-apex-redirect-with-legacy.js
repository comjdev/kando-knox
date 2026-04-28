// CloudFront Function: Redirects + index-document (combined - only 1 viewer-request allowed)
// TEMPORARY legacy block: remove when Google has reindexed. Then use www-to-apex-redirect.js
//
// Handles:
// 1. www → apex (permanent)
// 2. /academy → external URL (permanent)
// 3. Old site paths → new apex paths (TEMPORARY)
// 4. Shop paths → shop subdomain (TEMPORARY)
// 5. Index document: /about → /about/index.html for S3 (permanent)

var APEX = "knoxmartialarts.com.au";
var SHOP_URL = "https://shop.knoxmartialarts.com.au";
var ACADEMY_URL = "https://cf.knoxmartialarts.com.au/membership-area";

var OLD_TO_NEW = {
  "contact-us": "/contact",
  "teens-martial-arts": "/programs/adult-martial-arts-karate-knox",
  "adults-martial-arts": "/programs/adult-martial-arts-karate-knox",
  "senseiandy": "/about",
  "instructors": "/about",
  "chief-instructor-shihan-paul": "/about",
  "programs": "/",
  "little-dragon": "/programs/pre-school-martial-arts-karate-knox",
  "kinder-ninja": "/programs/pre-school-martial-arts-karate-knox",
  "junior-martial-arts": "/programs/junior-martial-arts-karate-knox",
  "bear-cave-bjj": "/programs/teen-adult-bjj-brazilian-jiu-jitsu-knox",
  "archive-page": "/blog",
  "getting-started": "/#footer-book-trial",
  "free-trial": "/#footer-book-trial",
};

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

  function appendQuery(base) {
    if (request.querystring && Object.keys(request.querystring).length > 0) {
      var parts = [];
      for (var key in request.querystring) {
        var param = request.querystring[key];
        var val = param.multiValue ? param.multiValue[0].value : (param.value || "");
        parts.push(encodeURIComponent(key) + "=" + encodeURIComponent(val));
      }
      return base + (base.indexOf("?") >= 0 ? "&" : "?") + parts.join("&");
    }
    return base;
  }

  // 1. Redirect www to apex (permanent)
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

  var pathNorm = uri.replace(/\/$/, "") || "/";

  // 2. Redirect /academy (permanent)
  if (pathNorm === "/academy") {
    return buildRedirect(ACADEMY_URL);
  }

  // 3 & 4. Legacy redirects (temporary - remove block when Google reindexed)
  if (host === APEX) {
    if (pathNorm.indexOf("/product/") === 0 || pathNorm.indexOf("/shop/") === 0 || pathNorm.indexOf("/s/") === 0) {
      return buildRedirect(appendQuery(SHOP_URL + uri));
    }
    var pathNoSlash = pathNorm === "/" ? "" : pathNorm.substring(1);
    if (OLD_TO_NEW[pathNoSlash]) {
      return buildRedirect(appendQuery("https://" + APEX + OLD_TO_NEW[pathNoSlash]));
    }
  }

  // 5. Index document: rewrite /about → /about/index.html for S3 (no directory indexes)
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
