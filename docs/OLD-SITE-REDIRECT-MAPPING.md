# Old Site → New Site Redirect Mapping

Pages from the previous site (www.knoxmartialarts.com.au, now under shop.knoxmartialarts.com.au) that need to redirect to the new apex site structure.

**Source:** [shop.knoxmartialarts.com.au/sitemap.xml](https://shop.knoxmartialarts.com.au/sitemap.xml)

---

## Informational Pages (old path → new path)

| Old Path (shop/formerly www) | New Path (apex) | Notes |
|-----------------------------|-----------------|-------|
| `/contact-us` | `/contact` | Contact page |
| `/teens-martial-arts` | `/programs/adult-martial-arts-karate-knox` | Teen & Adult Martial Arts |
| `/adults-martial-arts` | `/programs/adult-martial-arts-karate-knox` | Same program |
| `/senseiandy` | `/about` | Instructor / team |
| `/instructors` | `/about` | Team page |
| `/chief-instructor-shihan-paul` | `/about` | Chief instructor |
| `/programs` | `/` | Programs overview on home |
| `/little-dragon` | `/programs/pre-school-martial-arts-karate-knox` | Pre-school program |
| `/kinder-ninja` | `/programs/pre-school-martial-arts-karate-knox` | Pre-school program |
| `/junior-martial-arts` | `/programs/junior-martial-arts-karate-knox` | Junior Karate |
| `/bear-cave-bjj` | `/programs/teen-adult-bjj-brazilian-jiu-jitsu-knox` | BJJ program |
| `/archive-page` | `/blog` | Blog / archive |
| `/getting-started` | `/#footer-book-trial` | Book trial CTA |
| `/free-trial` | `/#footer-book-trial` | Book trial CTA |

## Pages That Match (no redirect needed)

| Path | Exists on new site |
|------|---------------------|
| `/` | `/` |
| `/about` | `/about` |
| `/timetable` | `/timetable` |

## Shop-Only Pages (redirect to shop subdomain)

These paths exist only on the shop; requests to apex get redirected to shop:

| Path Pattern | Redirect To | Notes |
|--------------|-------------|-------|
| `/product/*` | `https://shop.knoxmartialarts.com.au/product/*` | Product pages |
| `/shop/*` | `https://shop.knoxmartialarts.com.au/shop/*` | Shop categories |
| `/s/*` | `https://shop.knoxmartialarts.com.au/s/*` | Stories, shop search, orders |

---

## Implementation

**Temporary:** Deploy `www-to-apex-redirect-with-legacy.js` (includes these redirects).

**Permanent:** `www-to-apex-redirect.js` (www + academy only). Switch to this when Google has reindexed.

The CloudFront function handles:
1. www → apex redirect (preserves path)
2. Old informational paths → new apex paths
3. Shop paths (/product/*, /shop/*, /s/*) → shop subdomain
4. /academy → external academy URL
