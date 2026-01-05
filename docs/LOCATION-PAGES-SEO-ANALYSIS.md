# Location Pages SEO Analysis

## ✅ Current SEO Strengths

### 1. **Title Tags**

- ✅ Unique titles per location: `Karate in Boronia & Knox | Kando Martial Arts Knox | Karate | BJJ`
- ✅ Dynamic based on program type (Karate/BJJ)
- ✅ Includes location name and keywords
- ✅ Supports custom `titleTag` field in JSON
- ✅ Max length ~70 characters (good)

**Example:**

- Karate: `Karate in Boronia & Knox | Kando Martial Arts Knox | Karate | BJJ`
- BJJ: `BJJ in Boronia & Knox | Kando Martial Arts Knox | BJJ | Karate`

### 2. **Meta Descriptions**

- ✅ Unique descriptions per location
- ✅ Dynamic keywords based on program type
- ✅ Includes location name, Knox, Boronia
- ✅ Length: 160-300 characters (could optimize to 155-160)
- ✅ Uses `metaDescription` field if provided, falls back to `description`

**Current Implementation:**

```typescript
const programKeywords =
  programType === "BJJ"
    ? [
        "bjj classes",
        "brazilian jiu-jitsu",
        location.locationName,
        "Knox",
        "Boronia",
        "martial arts",
      ]
    : [
        "karate classes",
        location.locationName,
        "Knox",
        "Boronia",
        "martial arts",
      ];
```

### 3. **Structured Data (Schema.org)**

- ✅ **LocalBusiness Schema** - Comprehensive with:
  - Full NAP (Name, Address, Phone)
  - Geo coordinates
  - Area served (specific city + City of Knox)
  - Google Business Profile link
- ✅ **Service Schema** - Location-specific service
- ✅ **FAQPage Schema** - Dynamic FAQs with location name

**Current Schemas:**

1. `getLocationLocalBusinessSchema()` - Primary for local SEO
2. `getLocationServiceSchema()` - Service-specific
3. `getLocationFAQPageSchema()` - FAQ rich snippets

### 4. **Heading Structure**

- ✅ **H1**: One per page (in PageTemplate header)
  - Uses `location.title` (e.g., "Karate Classes near Boronia")
- ✅ **H2**: Section headings
  - Intro heading
  - Kando Info heading
  - Serving Area heading
  - Get to Kando heading
  - Programs heading (in LocationPrograms component)
  - FAQ heading
- ✅ **H3**: Sub-headings in programs section

**Current Structure:**

```
H1: {location.title} (e.g., "Karate Classes near Boronia")
  H2: Intro heading
  H2: Kando Info heading
  H2: Serving Area heading
  H2: Get to Kando heading
  H2: Our Karate/BJJ Programs
    H3: Program headings (e.g., "Pre-School Karate for Boronia Families")
  H2: FAQ heading
```

### 5. **Content Uniqueness**

- ✅ Unique content per location
- ✅ Location name dynamically inserted
- ✅ Unique "Get to Kando" section per suburb
- ✅ Unique "Serving Area" section with internal links
- ✅ Program descriptions include location name

### 6. **Internal Linking**

- ✅ **Serving Area section** links to other location pages:
  - Links to Wantirna, Bayswater, Rowville, Ferntree Gully
  - Uses `text-primary` class for visibility
- ✅ **Program links** in sidebar
- ✅ **Program links** in LocationPrograms component
- ✅ **Timetable link** in sidebar

**Example from Serving Area:**

```html
<a href="/locations/karate-wantirna">Wantirna</a>
<a href="/locations/karate-bayswater">Bayswater</a>
```

### 7. **Image Optimization**

- ✅ Hero images optimized (WebP conversion)
- ✅ Program images have alt text
- ✅ Alt text includes location name: `"${program.title} classes at Kando Martial Arts Knox in Boronia"`
- ✅ Lazy loading implemented
- ✅ Responsive images with proper sizes

**Alt Text Examples:**

- `"${classItem.heading} training at Kando Martial Arts Knox dojo in Boronia"`
- `"${program.title} classes at Kando Martial Arts Knox in Boronia"`

### 8. **URL Structure**

- ✅ Clean URLs: `/locations/karate-boronia`, `/locations/bjj-boronia`
- ✅ Descriptive slugs
- ✅ Consistent pattern

### 9. **Canonical URLs**

- ✅ Implemented in Layout component
- ✅ Uses: `${SITE_CONFIG.url}/locations/${location.slug}`

### 10. **Open Graph & Social**

- ✅ Open Graph tags (via SEO component)
- ✅ Twitter Cards
- ✅ Dynamic image per location
- ✅ Location-specific description

## 🔧 Issues & Recommendations

### Priority 1: Critical Issues

#### 1. **Missing Breadcrumb Navigation**

**Status:** ❌ Not implemented
**Impact:** HIGH - Missing navigation aid and breadcrumb schema

**Recommendation:**

- Add visual breadcrumb navigation
- Implement BreadcrumbList schema
- Structure: Home > Locations > [Location Name]

**Implementation Needed:**

```astro
<!-- Add to location page template -->
<nav aria-label="Breadcrumb" class="mb-4">
  <ol class="flex items-center space-x-2 text-sm">
    <li><a href="/">Home</a></li>
    <li>/</li>
    <li><a href="/locations">Locations</a></li>
    <li>/</li>
    <li aria-current="page">{location.locationName}</li>
  </ol>
</nav>
```

#### 2. **Meta Description Length**

**Status:** ⚠️ 160-300 chars (should be 155-160)
**Impact:** MEDIUM - May truncate in search results

**Current:** `formatMetaDescription()` creates 160-300 char descriptions
**Recommendation:** Optimize to 155-160 characters for Google display

#### 3. **Hardcoded "Boronia" in Alt Text**

**Status:** ⚠️ Alt text hardcodes "Boronia" instead of using `location.locationName`
**Impact:** MEDIUM - Incorrect alt text for non-Boronia locations

**Current Code:**

```astro
alt={`${program.title} classes at Kando Martial Arts Knox in Boronia`}
alt={`${classItem.heading} training at Kando Martial Arts Knox dojo in Boronia`}
```

**Fix Needed:**

```astro
alt={
  `${program.title} classes at Kando Martial Arts Knox in ${location.locationName}`
}
alt={
  `${classItem.heading} training at Kando Martial Arts Knox dojo in ${location.locationName}`
}
```

### Priority 2: Important Enhancements

#### 4. **Missing Opening Hours in Schema**

**Status:** ❌ Not in LocalBusiness schema
**Impact:** MEDIUM - Missing important local SEO signal

**Recommendation:** Add `openingHoursSpecification` to LocalBusiness schema

#### 5. **Service Schema Could Be More Specific**

**Status:** ⚠️ Generic service type
**Impact:** LOW-MEDIUM - Could be more specific for BJJ vs Karate

**Current:**

```typescript
serviceType: "Karate Training"; // Hardcoded
```

**Recommendation:** Make dynamic based on `programType`

#### 6. **Missing Review Schema**

**Status:** ⚠️ Review schema exists but not used on location pages
**Impact:** MEDIUM - Missing star ratings in search results

**Recommendation:** Add AggregateRating schema if reviews are available

#### 7. **Duplicate Testimonials Section**

**Status:** ⚠️ Testimonials component appears twice
**Impact:** LOW - May cause duplicate content concerns

**Current Code:**

```astro
{location.testimonials && <Testimonials testimonials={location.testimonials} />}
<!-- ... other sections ... -->
<Testimonials />
<!-- Duplicate without props -->
```

**Fix:** Remove duplicate or make conditional

### Priority 3: Nice-to-Have Improvements

#### 8. **Add "Related Locations" Section**

**Status:** ❌ Not implemented
**Impact:** LOW-MEDIUM - Could improve internal linking

**Recommendation:** Add section linking to nearby locations

#### 9. **Add Location-Specific FAQs to Schema**

**Status:** ⚠️ FAQ schema uses generic questions
**Impact:** LOW - Could be more location-specific

**Current:** Uses generic FAQ questions
**Recommendation:** Use actual FAQs from `location.faqs` in schema

#### 10. **Add Last Modified Date**

**Status:** ❌ Not tracked
**Impact:** LOW - Missing freshness signal

**Recommendation:** Add `lastModified` field to location JSON files

## 📊 Location Page SEO Checklist

### On-Page SEO

- [x] Unique title tags (max 70 chars)
- [x] Unique meta descriptions (155-160 optimal)
- [x] One H1 per page
- [x] Proper heading hierarchy
- [ ] Breadcrumb navigation
- [x] Canonical URLs
- [x] Internal linking structure
- [x] Unique content per location
- [ ] Location-specific alt text (currently hardcoded)

### Technical SEO

- [x] Clean URL structure
- [x] Mobile-responsive
- [x] Fast page load
- [x] HTTPS enabled
- [x] Structured data (Schema.org)
- [x] Image optimization
- [ ] Breadcrumb schema

### Local SEO

- [x] LocalBusiness schema
- [x] NAP consistency
- [x] Geo coordinates
- [x] Area served
- [ ] Opening hours
- [ ] Reviews/ratings schema
- [x] Google Business Profile link

### Content SEO

- [x] Location name in title
- [x] Location name in description
- [x] Location name in headings
- [x] Location name in content
- [x] Internal links to related locations
- [x] Program links

## 🎯 Quick Fixes Needed

### 1. Fix Hardcoded "Boronia" in Alt Text

**Files to Update:**

- `src/components/shared/PageTemplate.astro` (line 125)
- `src/components/locations/LocationPrograms.astro` (lines 82, 145)

**Change:**

```astro
<!-- From: -->alt={
  `${program.title} classes at Kando Martial Arts Knox in Boronia`
}

<!-- To: -->
alt={
  `${program.title} classes at Kando Martial Arts Knox in ${location.locationName}`
}
```

### 2. Remove Duplicate Testimonials

**File:** `src/pages/locations/[location].astro` (line 291)

**Remove:**

```astro
<Testimonials />
<!-- This duplicate line -->
```

### 3. Add Breadcrumbs

**Priority:** HIGH
**Effort:** MEDIUM
**Impact:** HIGH

### 4. Optimize Meta Description Length

**File:** `src/utils/descriptions.ts`
**Change:** Target 155-160 characters instead of 160-300

## 📈 Location Page Performance Metrics

### Current Implementation Score: 8.5/10

**Strengths:**

- Excellent structured data
- Unique content per location
- Good internal linking
- Proper heading structure
- Optimized images

**Weaknesses:**

- Missing breadcrumbs
- Hardcoded location names in alt text
- Meta descriptions could be optimized
- Missing opening hours in schema
- Duplicate testimonials component

## 🔍 Testing Checklist

Before deploying location pages, verify:

- [ ] All location pages have unique titles
- [ ] All location pages have unique meta descriptions
- [ ] Alt text uses dynamic location name (not hardcoded)
- [ ] Only one H1 per page
- [ ] Heading hierarchy is correct (H1 > H2 > H3)
- [ ] Structured data validates (Google Rich Results Test)
- [ ] Internal links work correctly
- [ ] Images have descriptive alt text
- [ ] No duplicate content between locations
- [ ] Canonical URLs are correct
- [ ] Mobile-friendly (Google Mobile-Friendly Test)

## 📝 Summary

**Overall Assessment:** Location pages have **excellent SEO foundation** with comprehensive structured data, unique content, and good technical implementation.

**Main Gaps:**

1. Missing breadcrumb navigation (high priority)
2. Hardcoded "Boronia" in alt text (medium priority)
3. Meta description length optimization (medium priority)
4. Missing opening hours in schema (low-medium priority)

**Recommendation:** Implement breadcrumbs and fix alt text issues first, as these are quick wins with high impact.
