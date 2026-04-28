// Legacy path redirects (TEMPORARY)
// Reference only. The logic is inlined in www-to-apex-redirect-with-legacy.js
//
// Remove once Google has reindexed old site URLs.
// When ready: redeploy www-to-apex-redirect.js (permanent only) and delete this file.
//
// See docs/OLD-SITE-REDIRECT-MAPPING.md for the full mapping.
//
// CloudFront allows only ONE function per viewer-request event, so we use
// www-to-apex-redirect-with-legacy.js for deployment until legacy redirects can be removed.

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

// Shop paths: /product/*, /shop/*, /s/* → https://shop.knoxmartialarts.com.au
