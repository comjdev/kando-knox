# SEO Manual Tasks - Action Required

This document lists all SEO-related tasks that need to be completed manually (cannot be automated).

## ✅ Completed Automatically

The following SEO improvements have been implemented in code:

1. ✅ **Title Tag Optimization** - Smart suffix generation (70 char limit)
2. ✅ **H1 Structure** - Added H1 to homepage (visually hidden, accessible)
3. ✅ **Image Alt Text** - Improved with keywords and descriptions
4. ✅ **Review Schema** - Added using Google reviews data
5. ✅ **BreadcrumbList Schema** - Already exists in schema.ts

---

## 📋 Manual Tasks Required

### 1. Google Search Console Setup ⚠️ HIGH PRIORITY

**What to do:**

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Add property: `https://knoxmartialarts.com.au`
3. Verify ownership using one of these methods:
   - HTML file upload (recommended)
   - HTML tag (add to `<head>`)
   - DNS record
   - Google Analytics (if already set up)
4. Submit sitemap: `https://knoxmartialarts.com.au/sitemap.xml`
5. Request indexing for key pages (homepage, main program pages)

**Why:** Monitor search performance, identify issues, track rankings

**Time:** 15-30 minutes

---

### 2. Google Business Profile ⚠️ HIGH PRIORITY

**What to do:**

1. Claim/verify your Google Business Profile
2. Ensure all information is complete:
   - Business name: "Kando Martial Arts Knox"
   - Address: Unit 2/5 Wadhurst Dr, Boronia VIC 3155
   - Phone: (03) 9800 5454
   - Website: https://knoxmartialarts.com.au
   - Business hours
   - Photos
   - Services offered
3. Get the Google Business Profile URL (for Review schema)
   - Format: `https://www.google.com/maps/place/...` or `https://g.page/...`
   - Share this URL so it can be added to the Review schema

**Why:** Local SEO, Google Maps visibility, review management

**Time:** 30-60 minutes

**Note:** Once you have the Google Business Profile URL, share it and it will be added to the Review schema automatically.

---

### 3. Verify H1 Structure ⚠️ MEDIUM PRIORITY

**What to do:**

1. Visit each page type and verify:
   - ✅ Homepage: Has H1 (visually hidden, accessible)
   - ✅ Program pages: Has H1 (in ProgramHeader component)
   - ✅ Location pages: Has H1 (in PageTemplate component)
   - ✅ Blog pages: Has H1 (check blog.astro and [post].astro)
   - ✅ Other pages: Check about, contact, timetable, testimonials
2. Ensure:
   - Only ONE H1 per page
   - H1 contains primary keyword
   - H1 is descriptive and unique

**Why:** SEO best practice, helps search engines understand page content

**Time:** 15-20 minutes

**Status:** Most pages already have H1s. Need to verify blog pages and other static pages.

---

### 4. Content Length Review ⚠️ MEDIUM PRIORITY

**What to do:**

1. Review key pages and ensure sufficient content:
   - Homepage: Should have 300+ words
   - Program pages: Should have 500+ words
   - Location pages: Should have 400+ words
   - Blog posts: Should have 800-1500 words
2. Add more content if pages are too short:
   - More details about programs
   - Location-specific information
   - Benefits and features
   - Testimonials or case studies

**Why:** More content = better SEO, more keywords, better user experience

**Time:** 2-4 hours (depending on how much content needs to be added)

---

### 5. Internal Linking Enhancement ⚠️ LOW PRIORITY

**What to do:**

1. Add contextual internal links in blog posts:
   - Link to relevant program pages
   - Link to location pages
   - Use descriptive anchor text (not "click here")
2. Add related content sections:
   - "Related Programs" on program pages
   - "Related Blog Posts" on blog posts
   - "Other Locations" on location pages

**Why:** Better site structure, improved crawlability, better user experience

**Time:** 1-2 hours

---

### 6. Social Media Testing ⚠️ LOW PRIORITY

**What to do:**

1. Test social sharing on key pages:
   - Share homepage on Facebook
   - Share a blog post on Twitter
   - Share a program page on LinkedIn
2. Verify:
   - Open Graph images display correctly (1200x630px)
   - Titles and descriptions are correct
   - Images are optimized
3. Fix any issues found

**Why:** Better social media presence, improved click-through rates

**Time:** 30 minutes

---

### 7. Mobile Testing ⚠️ MEDIUM PRIORITY

**What to do:**

1. Test on multiple devices:
   - iPhone (iOS)
   - Android phone
   - iPad/tablet
2. Verify:
   - Page loads quickly
   - Navigation works correctly
   - Touch targets are adequate (44x44px minimum)
   - Text is readable
   - Images display correctly
   - Forms work properly

**Why:** Mobile-first indexing, better user experience

**Time:** 30-60 minutes

---

### 8. Google Analytics Setup (if not done) ⚠️ MEDIUM PRIORITY

**What to do:**

1. Create Google Analytics 4 (GA4) property
2. Get Measurement ID (format: `G-XXXXXXXXXX`)
3. Update `SITE_CONFIG.googleAnalyticsId` in `src/config.ts`
4. Verify tracking is working:
   - Check Real-Time reports
   - Verify page views are being tracked

**Why:** Track website performance, user behavior, conversions

**Time:** 15-30 minutes

**Note:** Currently set to `"G-XXXXXXXXXX"` (placeholder). Update with real ID.

---

### 9. Monitor Core Web Vitals ⚠️ ONGOING

**What to do:**

1. After deploying, monitor in Google Search Console:
   - Largest Contentful Paint (LCP) - Target: < 2.5s
   - First Input Delay (FID) - Target: < 100ms
   - Cumulative Layout Shift (CLS) - Target: < 0.1
2. Check monthly and address any issues

**Why:** Core Web Vitals affect search rankings

**Time:** 15 minutes per month

---

### 10. Regular Content Updates ⚠️ ONGOING

**What to do:**

1. Publish new blog posts regularly (monthly or bi-weekly)
2. Update program information as needed
3. Add new testimonials/reviews
4. Update location pages with new information

**Why:** Fresh content signals active business, better SEO

**Time:** 2-4 hours per month

---

## 📊 Priority Summary

### Do Immediately (This Week)

1. ✅ Google Search Console setup
2. ✅ Google Business Profile verification
3. ✅ Verify H1 structure

### Do Soon (This Month)

4. Content length review
5. Google Analytics setup (if not done)
6. Mobile testing

### Do When Time Permits

7. Internal linking enhancement
8. Social media testing
9. Monitor Core Web Vitals (ongoing)
10. Regular content updates (ongoing)

---

## 🔗 Useful Resources

- [Google Search Console](https://search.google.com/search-console)
- [Google Business Profile](https://www.google.com/business/)
- [Google Analytics](https://analytics.google.com/)
- [PageSpeed Insights](https://pagespeed.web.dev/)
- [Schema.org Documentation](https://schema.org/)

---

## 📝 Notes

- All automated SEO improvements are complete
- Review schema uses Google reviews from `google-reviews.json`
- If you have a Google Business Profile URL, share it to add to Review schema
- Most technical SEO is already optimized
- Focus on content and manual verification tasks

---

## ✅ Checklist

- [ ] Google Search Console setup
- [ ] Google Business Profile verified
- [ ] Google Business Profile URL shared (for Review schema)
- [ ] H1 structure verified on all pages
- [ ] Content length reviewed
- [ ] Google Analytics ID updated
- [ ] Mobile testing completed
- [ ] Social media sharing tested
- [ ] Internal linking enhanced
- [ ] Core Web Vitals monitoring set up
