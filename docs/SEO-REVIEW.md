# SEO Review & Recommendations

## ✅ Current SEO Strengths

### 1. **Meta Tags & Open Graph**
- ✅ Comprehensive Open Graph tags (og:title, og:description, og:image, og:type, og:locale)
- ✅ Twitter Card implementation (summary_large_image)
- ✅ Geographic meta tags (geo.region, geo.placename, geo.position, ICBM)
- ✅ Canonical URLs implemented
- ✅ Robots meta tag support (noindex/nofollow)

### 2. **Structured Data (Schema.org)**
- ✅ Organization schema
- ✅ LocalBusiness schema (with geo coordinates)
- ✅ Service schema for programs
- ✅ FAQPage schema for location/program pages
- ✅ BlogPosting schema for blog posts
- ✅ SportsActivityLocation schema
- ✅ Review/AggregateRating schema support

### 3. **Technical SEO**
- ✅ Sitemap generation (`@astrojs/sitemap`)
- ✅ robots.txt configured
- ✅ HTML compression enabled
- ✅ Image optimization (WebP conversion)
- ✅ Semantic HTML5 elements
- ✅ Skip to main content link (accessibility)

### 4. **Content SEO**
- ✅ Unique titles per page (max 70 chars)
- ✅ Meta descriptions (160-300 chars)
- ✅ Dynamic keywords based on program type
- ✅ Unique content per location page

## 🔧 Recommended Improvements

### Priority 1: Critical SEO Enhancements

#### 1. **Add Breadcrumb Navigation & Schema**
**Current Status:** No breadcrumbs found
**Impact:** High - Improves user navigation and search result display

**Recommendation:**
- Add visual breadcrumb navigation to all pages
- Implement BreadcrumbList schema for all pages
- Example structure: Home > Programs > [Program Name] or Home > Locations > [Location]

**Implementation:**
```typescript
// Add to src/utils/schema.ts
export function getBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_CONFIG.url}${item.url}`,
    })),
  };
}
```

#### 2. **Optimize Meta Description Length**
**Current Status:** 160-300 characters
**Issue:** Google typically shows 155-160 characters in search results

**Recommendation:**
- Target 155-160 characters for optimal display
- Keep longer descriptions (up to 300) for social sharing, but prioritize 155-160 for search

**Current Code Location:** `src/utils/descriptions.ts`

#### 3. **Add Article Author to Blog Posts**
**Current Status:** BlogPosting schema uses Organization as author
**Recommendation:** Add individual author support

**Implementation:**
```typescript
// In BlogPosting schema, add:
author: {
  "@type": "Person",
  name: post.frontmatter.author || SITE_CONFIG.title,
  url: `${SITE_CONFIG.url}/about`, // Link to about page
}
```

#### 4. **Improve Sitemap Configuration**
**Current Status:** Uses `new Date()` for all pages
**Recommendation:** Use actual last modified dates from content files

**Implementation:**
```javascript
// In astro.config.mjs sitemap config:
sitemap({
  changefreq: "weekly",
  priority: 0.7,
  // Use actual lastmod from content files
  customPages: async () => {
    // Return pages with actual lastmod dates
  },
})
```

### Priority 2: Important Enhancements

#### 5. **Add Missing Image Alt Tags**
**Current Status:** Some images have alt tags, but not all
**Recommendation:** Ensure ALL images have descriptive alt text

**Check:**
- Hero images on location pages
- Program images
- Blog post featured images
- Team member photos

#### 6. **Add Language Tags (if needed)**
**Current Status:** Only `en-AU` locale
**Recommendation:** If you plan to serve other languages/regions, add hreflang tags

**Implementation:**
```html
<link rel="alternate" hreflang="en-AU" href="https://knoxmartialarts.com.au" />
<link rel="alternate" hreflang="x-default" href="https://knoxmartialarts.com.au" />
```

#### 7. **Enhance Internal Linking**
**Current Status:** Basic internal links
**Recommendation:**
- Add contextual internal links within content
- Link related programs/locations to each other
- Add "Related Articles" section to blog posts

#### 8. **Add Video Schema (if applicable)**
**Current Status:** No video schema found
**Recommendation:** If you have video content (academy videos), add VideoObject schema

**Implementation:**
```typescript
export function getVideoObjectSchema(data: {
  name: string;
  description: string;
  thumbnailUrl: string;
  uploadDate: string;
  contentUrl: string;
  embedUrl?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: data.name,
    description: data.description,
    thumbnailUrl: data.thumbnailUrl,
    uploadDate: data.uploadDate,
    contentUrl: data.contentUrl,
    ...(data.embedUrl && { embedUrl: data.embedUrl }),
  };
}
```

### Priority 3: Performance & UX SEO

#### 9. **Add Preload for Critical Resources**
**Current Status:** Preconnect hints present
**Recommendation:** Add preload for critical fonts and above-the-fold images

**Implementation:**
```html
<link rel="preload" href="/fonts/space-grotesk.woff2" as="font" type="font/woff2" crossorigin />
<link rel="preload" href="/img/hero/karate-kando-knox.jpg" as="image" />
```

#### 10. **Improve Mobile-First SEO**
**Current Status:** Responsive design present
**Recommendation:**
- Ensure all interactive elements are touch-friendly (min 44x44px)
- Test mobile page speed (aim for < 3s load time)
- Verify mobile usability in Google Search Console

#### 11. **Add FAQ Schema to Homepage**
**Current Status:** FAQ schema only on location/program pages
**Recommendation:** Add common FAQs to homepage with FAQPage schema

#### 12. **Enhance Local SEO**
**Current Status:** Good LocalBusiness schema
**Recommendation:**
- Add opening hours to LocalBusiness schema
- Add price range (already present: "$$")
- Add payment methods accepted
- Add amenities/features (parking, accessibility, etc.)

**Implementation:**
```typescript
// Add to LocalBusiness schema:
openingHoursSpecification: [
  {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    opens: "16:00",
    closes: "20:00",
  },
],
paymentAccepted: "Cash, Credit Card, Bank Transfer",
currenciesAccepted: "AUD",
```

## 📊 SEO Checklist

### On-Page SEO
- [x] Unique title tags (max 70 chars)
- [x] Meta descriptions (155-160 chars optimal)
- [x] H1 tags (one per page)
- [x] Proper heading hierarchy (H1 > H2 > H3)
- [x] Alt text for images
- [ ] Breadcrumb navigation
- [x] Canonical URLs
- [x] Internal linking structure

### Technical SEO
- [x] XML sitemap
- [x] robots.txt
- [x] Mobile-responsive design
- [x] Fast page load times
- [x] HTTPS enabled
- [x] Structured data (Schema.org)
- [ ] Last modified dates in sitemap

### Content SEO
- [x] Unique content per page
- [x] Keyword optimization (natural)
- [x] Location-based content
- [x] Regular blog content
- [ ] Content freshness (update dates)

### Local SEO
- [x] LocalBusiness schema
- [x] NAP consistency (Name, Address, Phone)
- [x] Google Business Profile link
- [ ] Opening hours in schema
- [ ] Reviews schema (if reviews available)

### Social SEO
- [x] Open Graph tags
- [x] Twitter Cards
- [x] Social sharing buttons (if applicable)

## 🎯 Quick Wins (Easy to Implement)

1. **Add breadcrumbs** - High impact, medium effort
2. **Optimize meta descriptions** - High impact, low effort
3. **Add lastmod dates to sitemap** - Medium impact, low effort
4. **Add opening hours to schema** - Medium impact, low effort
5. **Ensure all images have alt text** - Medium impact, low effort

## 📈 Monitoring & Maintenance

### Tools to Use:
- Google Search Console - Monitor search performance
- Google Analytics - Track user behavior
- PageSpeed Insights - Monitor page speed
- Schema Markup Validator - Validate structured data
- Mobile-Friendly Test - Ensure mobile usability

### Regular Tasks:
- [ ] Review search performance monthly
- [ ] Update sitemap when adding new content
- [ ] Monitor Core Web Vitals
- [ ] Check for broken links quarterly
- [ ] Update structured data when business info changes

## 🔍 Testing Checklist

Before deploying, verify:
- [ ] All pages have unique titles
- [ ] All pages have meta descriptions
- [ ] All images have alt text
- [ ] Structured data validates (use Google's Rich Results Test)
- [ ] Sitemap is accessible at `/sitemap.xml`
- [ ] robots.txt allows crawling
- [ ] Canonical URLs are correct
- [ ] Mobile-friendly (Google Mobile-Friendly Test)
- [ ] Page speed is acceptable (< 3s)

## 📝 Notes

- The current SEO implementation is **very good** overall
- Main gaps are breadcrumbs and some schema enhancements
- Most improvements are incremental rather than critical
- Focus on content quality and user experience alongside technical SEO

