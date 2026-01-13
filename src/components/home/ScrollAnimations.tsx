import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function ScrollAnimations() {
  useEffect(() => {
    // Check for reduced motion preference - respect user accessibility settings
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    
    // If user prefers reduced motion, skip all animations
    if (prefersReducedMotion) {
      return;
    }

    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    // Set initial states IMMEDIATELY to prevent flash
    // Use a script that runs before React hydration if possible
    const setInitialStyles = () => {
      const mainContent = document.querySelector("main#main-content");
      if (!mainContent) return;

      // Immediately hide header elements with background images (location pages)
      const headerElements = mainContent.querySelectorAll("header[style*='background-image']");
      headerElements.forEach((header) => {
        if (!header.closest(".hero-carousel-wrapper")) {
          header.style.setProperty("opacity", "0", "important");
          header.style.setProperty("filter", "blur(10px)", "important");
          header.style.setProperty("will-change", "opacity, filter", "important");
        }
      });

      const allSections = Array.from(mainContent.querySelectorAll("section"));
      const sectionsToAnimate = allSections.filter((section) => {
        const hasHeroCarousel = section.querySelector(".hero-carousel-wrapper");
        return !hasHeroCarousel;
      });

      // Immediately hide first section images to prevent flash
      const firstSection = sectionsToAnimate[0];
      if (firstSection) {
        const firstSectionImages = firstSection.querySelectorAll("img");
        firstSectionImages.forEach((img) => {
          // Skip hero carousel images and bear cave logo
          if (img.closest(".hero-carousel-wrapper")) return;
          if (img.alt?.toLowerCase().includes("bear cave") || 
              img.src?.toLowerCase().includes("bear-cave")) return;
          
          // Check if this is a team photo (in team section)
          const section = img.closest("section");
          const isTeamPhoto = section && (
            section.querySelector("h2")?.textContent?.toLowerCase().includes("people make us great") ||
            section.querySelector("h2")?.textContent?.toLowerCase().includes("our team")
          );
          
          if (isTeamPhoto) {
            // Team photos use scale animation, not blur
            img.style.setProperty("opacity", "0", "important");
            img.style.setProperty("transform", "scale(0.95)", "important");
            img.style.setProperty("will-change", "opacity, transform", "important");
          } else {
            // Other first section images use blur
            img.style.setProperty("opacity", "0", "important");
            img.style.setProperty("filter", "blur(10px)", "important");
            img.style.setProperty("will-change", "opacity, filter", "important");
          }
        });
      }
    };

    // Run immediately
    setInitialStyles();
    
    // Also run on next tick to catch any late-loading images
    requestAnimationFrame(setInitialStyles);

    // Wait a bit to ensure hero slider and navigation are initialized
    const initAnimations = () => {
      // Target sections within main#main-content, including nested sections
      // This handles both direct children and sections inside PageTemplate/article
      const mainContent = document.querySelector("main#main-content");
      if (!mainContent) return;

      // Get all sections within main (including nested ones in articles, etc.)
      const allSections = Array.from(mainContent.querySelectorAll("section"));

      if (allSections.length === 0) {
        return;
      }

      // Filter out any sections that might be part of hero slider
      const sectionsToAnimate = allSections.filter((section) => {
        // Exclude hero section and any section containing hero carousel
        const hasHeroCarousel = section.querySelector(".hero-carousel-wrapper");
        return !hasHeroCarousel;
      });

      // Animate header elements with background images (location pages, etc.)
      const headerElements = mainContent.querySelectorAll("header[style*='background-image']");
      headerElements.forEach((header) => {
        // Skip if it's part of hero carousel
        if (header.closest(".hero-carousel-wrapper")) {
          return;
        }

        // Set initial state with blur
        gsap.set(header, {
          opacity: 0,
          filter: "blur(10px)",
          willChange: "opacity, filter",
        });

        // Function to animate the header
        const animateHeader = () => {
          gsap.to(header, {
            opacity: 1,
            filter: "blur(0px)",
            duration: 1.2,
            ease: "power2.out",
            willChange: "auto",
          });
        };

        // Check if background image is loaded by creating an image element
        const style = window.getComputedStyle(header);
        const bgImage = style.backgroundImage;
        if (bgImage && bgImage !== "none") {
          // Extract URL from background-image style
          const urlMatch = bgImage.match(/url\(['"]?([^'"]+)['"]?\)/);
          if (urlMatch && urlMatch[1]) {
            const imgUrl = urlMatch[1];
            const img = new Image();
            img.onload = animateHeader;
            img.onerror = () => {
              // If image fails to load, animate anyway after a delay
              setTimeout(animateHeader, 100);
            };
            img.src = imgUrl;
            
            // Fallback: if image is already cached, animate immediately
            if (img.complete) {
              animateHeader();
            }
          } else {
            // If we can't extract URL, animate immediately
            animateHeader();
          }
        } else {
          // No background image, animate immediately
          animateHeader();
        }
      });

      // Animate the first section's images (program header or similar)
      // Use a subtle blur-to-clear fade-in that waits for image to load
      const firstSection = sectionsToAnimate[0];
      if (firstSection) {
        // Find all images in the first section (typically the header image)
        const firstSectionImages = firstSection.querySelectorAll("img");
        firstSectionImages.forEach((img) => {
          // Skip if image is part of hero carousel or bear cave logo
          if (img.closest(".hero-carousel-wrapper")) {
            return;
          }
          // Skip bear cave logo
          if (img.alt?.toLowerCase().includes("bear cave") || 
              img.src?.toLowerCase().includes("bear-cave")) {
            return;
          }

          // Check if this is a team photo
          const section = img.closest("section");
          const isTeamPhoto = section && (
            section.querySelector("h2")?.textContent?.toLowerCase().includes("people make us great") ||
            section.querySelector("h2")?.textContent?.toLowerCase().includes("our team")
          );

          if (isTeamPhoto) {
            // Team photos use scale animation (same as other section images)
            gsap.set(img, {
              opacity: 0,
              scale: 0.95,
              willChange: "opacity, transform",
            });

            gsap.to(img, {
              opacity: 1,
              scale: 1,
              duration: 0.8,
              ease: "power2.out",
              willChange: "auto",
              scrollTrigger: {
                trigger: img,
                start: "top 85%",
                toggleActions: "play none none none",
                invalidateOnRefresh: true,
              },
            });
          } else {
            // Other first section images use blur animation
            // Ensure initial state is set (in case it wasn't set earlier)
            gsap.set(img, {
              opacity: 0,
              filter: "blur(10px)",
              willChange: "opacity, filter",
            });

            // Function to animate the image
            const animateImage = () => {
              gsap.to(img, {
                opacity: 1,
                filter: "blur(0px)",
                duration: 1.2,
                ease: "power2.out",
                willChange: "auto",
              });
            };

            // Check if image is already loaded
            if (img.complete && img.naturalHeight !== 0) {
              // Image is already loaded, animate immediately
              animateImage();
            } else {
              // Wait for image to load, then animate
              img.addEventListener("load", animateImage, { once: true });
              // Fallback: if load event doesn't fire (e.g., cached images), check after a delay
              setTimeout(() => {
                if (img.complete && img.naturalHeight !== 0) {
                  animateImage();
                }
              }, 100);
            }
          }
        });
      }

      // Animate sections (skip first section for section-level animation)
      sectionsToAnimate.slice(1).forEach((section) => {
        // Set initial state - hidden and slightly below
        // Use will-change for better performance
        gsap.set(section, {
          opacity: 0,
          y: 30,
          willChange: "opacity, transform",
        });

        // Create animation timeline
        gsap.to(section, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          willChange: "auto", // Reset will-change after animation
          scrollTrigger: {
            trigger: section,
            start: "top 85%", // Start animation when section is 85% down the viewport
            end: "bottom 20%",
            toggleActions: "play none none none", // Only play once when entering
            // Prevent conflicts with other scroll-based functionality
            invalidateOnRefresh: true,
          },
        });

        // Animate images within each section
        const images = section.querySelectorAll("img");
        images.forEach((img) => {
          // Skip if image is already animated, part of hero carousel, or bear cave logo
          if (img.closest(".hero-carousel-wrapper")) {
            return;
          }
          // Skip bear cave logo
          if (img.alt?.toLowerCase().includes("bear cave") || 
              img.src?.toLowerCase().includes("bear-cave")) {
            return;
          }

          gsap.set(img, {
            opacity: 0,
            scale: 0.95,
            willChange: "opacity, transform",
          });

          gsap.to(img, {
            opacity: 1,
            scale: 1,
            duration: 0.8,
            ease: "power2.out",
            willChange: "auto",
            scrollTrigger: {
              trigger: img,
              start: "top 85%",
              toggleActions: "play none none none",
              invalidateOnRefresh: true,
            },
          });
        });
      });

      // Animate testimonial cards with slow slide-up effect and staggered appearance
      // Perfect for masonry layout - cards cascade in sequence
      const testimonialCards = Array.from(mainContent.querySelectorAll("[data-testimonial-card]"));
      if (testimonialCards.length > 0) {
        // Set initial state for all cards
        gsap.set(testimonialCards, {
          opacity: 0,
          y: 40, // Start further down for more pronounced slide-up
          willChange: "opacity, transform",
        });

        // Find the testimonials section container
        const testimonialsSection = testimonialCards[0]?.closest("section");
        if (testimonialsSection) {
          // Check which cards are initially visible
          const viewportHeight = window.innerHeight;
          const initiallyVisible: Element[] = [];
          const notInitiallyVisible: Element[] = [];

          testimonialCards.forEach((card) => {
            const rect = card.getBoundingClientRect();
            // Check if card is in viewport or close to it
            if (rect.top < viewportHeight * 1.2) {
              initiallyVisible.push(card);
            } else {
              notInitiallyVisible.push(card);
            }
          });

          // Animate initially visible cards with stagger when section comes into view
          if (initiallyVisible.length > 0) {
            const tl = gsap.timeline({
              scrollTrigger: {
                trigger: testimonialsSection,
                start: "top 85%",
                toggleActions: "play none none none",
                invalidateOnRefresh: true,
              },
            });

            // Animate initially visible cards with stagger
            tl.to(initiallyVisible, {
              opacity: 1,
              y: 0,
              duration: 1,
              ease: "power2.out",
              willChange: "auto",
              stagger: {
                amount: 0.8, // Total stagger time across visible cards
                from: "start",
              },
            });
          }

          // Animate remaining cards individually as they scroll into view
          notInitiallyVisible.forEach((card, index) => {
            gsap.to(card, {
              opacity: 1,
              y: 0,
              duration: 1,
              ease: "power2.out",
              willChange: "auto",
              scrollTrigger: {
                trigger: card,
                start: "top 90%",
                toggleActions: "play none none none",
                invalidateOnRefresh: true,
              },
            });
          });
        }
      }
    };

    // Wait for DOM and other scripts to initialize
    // Use requestAnimationFrame to ensure hero slider is ready
    const timeoutId = setTimeout(() => {
      requestAnimationFrame(() => {
        requestAnimationFrame(initAnimations);
      });
    }, 100);

    // Cleanup function
    return () => {
      clearTimeout(timeoutId);
      ScrollTrigger.getAll().forEach((trigger) => {
        // Kill triggers that we created (sections and images)
        const triggerElement = trigger.trigger;
        if (triggerElement) {
          // Check if it's a section (not hero carousel) or an image
          if (triggerElement.tagName === "SECTION") {
            const hasHeroCarousel = triggerElement.querySelector(".hero-carousel-wrapper");
            if (!hasHeroCarousel) {
              trigger.kill();
            }
          } else if (triggerElement.tagName === "IMG") {
            // Only kill image triggers that aren't part of hero carousel
            if (!triggerElement.closest(".hero-carousel-wrapper")) {
              trigger.kill();
            }
          }
        }
      });
    };
  }, []);

  // No need to return style tag - we handle initial hiding via JavaScript
  // This prevents hydration mismatches
  return null;
}
