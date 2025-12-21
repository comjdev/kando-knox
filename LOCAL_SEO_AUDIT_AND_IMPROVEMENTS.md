# Local SEO Audit & Improvements for Location Pages

## Current State Analysis

### ✅ What's Already Good

1. **H1 Structure** ✅
   - Each location page has a unique H1 in PageTemplate
   - H1 contains location name and program type

2. **Location-Specific Content** ✅
   - Unique content per location
   - Location name mentioned throughout
   - Directions from each suburb
   - Serving area information

3. **Internal Linking** ✅
   - Links to other location pages
   - Links to program pages
   - Good site structure

4. **Meta Descriptions** ✅
   - Using formatMetaDescription with location keywords
   - 160-300 character range

5. **Schema Markup** ✅
   - Service schema (location-specific)
   - FAQPage schema (location-specific)

6. **Google Maps Integration** ✅
   - LocationMap component with embedded map
   - Address displayed

---

## 🔍 Issues Found & Improvements Needed

### 1. **Missing LocalBusiness Schema** ⚠️ HIGH PRIORITY

**Issue:** Currently using Service schema, but LocalBusiness schema is better for local SEO.

**Impact:** Search engines may not fully understand this is a local business serving specific areas.

**Solution:** Add LocalBusiness schema with:

- Full NAP (Name, Address, Phone)
- Geographic coordinates
- Service area
- Opening hours (if available)
- Price range

---

### 2. **NAP (Name, Address, Phone) Not Prominently Displayed** ⚠️ MEDIUM PRIORITY

**Issue:** NAP is in Footer and LocationMap, but should be more prominent on location pages.

**Impact:** Users and search engines need clear NAP information for local SEO.

**Solution:** Add a dedicated NAP section near the top of location pages.

---

### 3. **Missing Geographic Coordinates in Schema** ⚠️ MEDIUM PRIORITY

**Issue:** Service schema doesn't include geographic coordinates.

**Impact:** Search engines can't precisely understand location.

**Solution:** Add geo coordinates to LocalBusiness schema.

---

### 4. **Missing Opening Hours** ⚠️ LOW PRIORITY

**Issue:** No opening hours in schema or on page.

**Impact:** Missing important local business information.

**Solution:** Add opening hours schema (if available).

---

### 5. **Missing Local Keywords in Alt Text** ⚠️ LOW PRIORITY

**Issue:** Some images may not have location-specific alt text.

**Impact:** Missing local SEO opportunity.

**Solution:** Ensure all images have location keywords in alt text.

---

## 🚀 Implemented Improvements

### 1. Enhanced LocalBusiness Schema

Added comprehensive LocalBusiness schema function that includes:

- Full NAP (Name, Address, Phone)
- Geographic coordinates
- Service area (location-specific)
- Price range
- URL to Google Business Profile

### 2. NAP Display Component

Created a dedicated NAP section component for location pages that displays:

- Business name
- Full address
- Phone number
- Link to Google Maps
- Link to Google Business Profile

### 3. Enhanced Location Schema

Updated location page schema to include:

- LocalBusiness schema (primary)
- Service schema (secondary)
- FAQPage schema (for rich snippets)

---

## 📋 Implementation Details

### Schema Structure

Each location page now has:

1. **LocalBusiness Schema** (Primary)
   - Full business information
   - NAP data
   - Geographic coordinates
   - Service area

2. **Service Schema** (Secondary)
   - Location-specific service
   - Service area

3. **FAQPage Schema** (Rich Snippets)
   - Location-specific FAQs

### NAP Display

NAP information is displayed:

- In Footer (site-wide)
- In LocationMap component
- In new NAP section on location pages (if added)

---

## ✅ Local SEO Checklist

### Technical SEO

- [x] H1 tag with location name
- [x] Unique title tags per location
- [x] Meta descriptions with location keywords
- [x] Canonical URLs
- [x] Schema markup (LocalBusiness, Service, FAQPage)
- [x] Geographic coordinates in schema
- [x] Google Maps integration
- [x] Mobile-responsive design

### Content SEO

- [x] Location-specific content
- [x] Location name in headings
- [x] Directions from location
- [x] Serving area information
- [x] Internal linking to other locations
- [x] Location keywords throughout

### Local Business Signals

- [x] NAP consistency (Name, Address, Phone)
- [x] Address in schema
- [x] Phone number in schema
- [x] Geographic coordinates
- [x] Service area defined
- [ ] Opening hours (if available)
- [x] Google Maps embed
- [x] Google Business Profile link

---

## 📊 Expected Impact

### Before Improvements

- Service schema only (less specific for local SEO)
- NAP not prominently displayed
- Missing geographic coordinates in schema

### After Improvements

- LocalBusiness schema (better for local search)
- Prominent NAP display
- Full geographic information
- Better local search visibility

---

## 🎯 Next Steps

1. **Add Opening Hours** (if available)
   - Add to config.ts
   - Include in LocalBusiness schema
   - Display on location pages

2. **Add Reviews to Location Pages** (optional)
   - Filter reviews by location if possible
   - Add Review schema to location pages

3. **Add Local Citations** (external)
   - List business on local directories
   - Ensure NAP consistency across web

4. **Monitor Local Search Performance**
   - Track rankings for "[service] in [location]"
   - Monitor Google Business Profile insights
   - Track local pack visibility

---

## 📝 Notes

- All location pages follow the same structure
- Content is unique per location
- Schema is automatically generated per location
- NAP is consistent across all pages
- Geographic information is accurate
