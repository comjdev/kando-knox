import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function ScrollAnimations() {
  useEffect(() => {
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    // Set initial states IMMEDIATELY to prevent flash
    // Use a script that runs before React hydration if possible
    const setInitialStyles = () => {
      const mainContent = document.querySelector("main#main-content");
      if (!mainContent) return;

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
      // Only target sections that are direct children of main, excluding hero section
      // Use very specific selector to avoid conflicts with hero slider and navigation
      const mainContent = document.querySelector("main#main-content");
      if (!mainContent) return;

      // Get all sections
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
