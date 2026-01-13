import { useEffect, useRef } from "react";
// Import specific GSAP modules for better tree-shaking
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin once (outside component for better performance)
gsap.registerPlugin(ScrollTrigger);

// Helper function to check if element should be animated
function shouldSkipElement(element: Element): boolean {
  // Skip hero carousel elements
  if (element.closest(".hero-carousel-wrapper")) return true;

  // Skip bear cave logo
  if (element instanceof HTMLImageElement) {
    if (
      element.alt?.toLowerCase().includes("bear cave") ||
      element.src?.toLowerCase().includes("bear-cave")
    ) {
      return true;
    }
  }

  return false;
}

// Helper function to check if image is a team photo
function isTeamPhoto(img: HTMLImageElement): boolean {
  const section = img.closest("section");
  const heading = section?.querySelector("h2")?.textContent?.toLowerCase();
  if (!heading) return false;

  return (
    heading.includes("people make us great") || heading.includes("our team")
  );
}

// Helper function to animate header elements
function animateHeaderElements(mainContent: Element) {
  const headerElements = mainContent.querySelectorAll(
    "header[style*='background-image']"
  );

  headerElements.forEach((header) => {
    if (shouldSkipElement(header)) return;

    gsap.set(header, {
      opacity: 0,
      filter: "blur(10px)",
      willChange: "opacity, filter",
    });

    const animateHeader = () => {
      gsap.to(header, {
        opacity: 1,
        filter: "blur(0px)",
        duration: 1.2,
        ease: "power2.out",
        willChange: "auto",
      });
    };

    const style = window.getComputedStyle(header);
    const bgImage = style.backgroundImage;

    if (bgImage && bgImage !== "none") {
      const urlMatch = /url\(['"]?([^'"]+)['"]?\)/.exec(bgImage);
      if (urlMatch?.[1]) {
        const img = new Image();
        img.onload = animateHeader;
        img.onerror = () => setTimeout(animateHeader, 100);
        img.src = urlMatch[1];

        if (img.complete) {
          animateHeader();
        }
      } else {
        animateHeader();
      }
    } else {
      animateHeader();
    }
  });
}

// Helper function to animate first section images
function animateFirstSectionImages(firstSection: Element) {
  const images = firstSection.querySelectorAll("img");

  images.forEach((img) => {
    if (shouldSkipElement(img)) return;

    const htmlImg = img as HTMLImageElement;
    const useTeamPhotoAnimation = isTeamPhoto(htmlImg);

    if (useTeamPhotoAnimation) {
      gsap.set(htmlImg, {
        opacity: 0,
        scale: 0.95,
        willChange: "opacity, transform",
      });

      gsap.to(htmlImg, {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        ease: "power2.out",
        willChange: "auto",
        scrollTrigger: {
          trigger: htmlImg,
          start: "top 85%",
          toggleActions: "play none none none",
          invalidateOnRefresh: true,
        },
      });
    } else {
      gsap.set(htmlImg, {
        opacity: 0,
        filter: "blur(10px)",
        willChange: "opacity, filter",
      });

      let animated = false;
      const animateImage = () => {
        if (animated) return;
        animated = true;
        gsap.to(htmlImg, {
          opacity: 1,
          filter: "blur(0px)",
          duration: 1.2,
          ease: "power2.out",
          willChange: "auto",
        });
      };

      if (htmlImg.complete && htmlImg.naturalHeight !== 0) {
        animateImage();
      } else {
        htmlImg.addEventListener("load", animateImage, { once: true });
        setTimeout(() => {
          if (!animated && htmlImg.complete && htmlImg.naturalHeight !== 0) {
            animateImage();
          }
        }, 100);
      }
    }
  });
}

// Helper function to animate sections
function animateSections(sections: Element[]) {
  sections.forEach((section) => {
    gsap.set(section, {
      opacity: 0,
      y: 30,
      willChange: "opacity, transform",
    });

    gsap.to(section, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power2.out",
      willChange: "auto",
      scrollTrigger: {
        trigger: section,
        start: "top 85%",
        end: "bottom 20%",
        toggleActions: "play none none none",
        invalidateOnRefresh: true,
      },
    });

    // Animate images within section
    const images = section.querySelectorAll("img");
    images.forEach((img) => {
      if (shouldSkipElement(img)) return;

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
}

// Helper function to animate testimonial cards
function animateTestimonialCards(mainContent: Element) {
  const testimonialCards = Array.from(
    mainContent.querySelectorAll("[data-testimonial-card]")
  );
  if (testimonialCards.length === 0) return;

  gsap.set(testimonialCards, {
    opacity: 0,
    y: 40,
    willChange: "opacity, transform",
  });

  const testimonialsSection = testimonialCards[0]?.closest("section");
  if (!testimonialsSection) return;

  const viewportHeight = globalThis.innerHeight;
  const initiallyVisible: Element[] = [];
  const notInitiallyVisible: Element[] = [];

  testimonialCards.forEach((card) => {
    const rect = card.getBoundingClientRect();
    if (rect.top < viewportHeight * 1.2) {
      initiallyVisible.push(card);
    } else {
      notInitiallyVisible.push(card);
    }
  });

  if (initiallyVisible.length > 0) {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: testimonialsSection,
        start: "top 85%",
        toggleActions: "play none none none",
        invalidateOnRefresh: true,
      },
    });

    tl.to(initiallyVisible, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power2.out",
      willChange: "auto",
      stagger: {
        amount: 0.8,
        from: "start",
      },
    });
  }

  notInitiallyVisible.forEach((card) => {
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

// Helper function to set initial styles (prevent flash)
function setInitialStyles(mainContent: Element) {
  const headerElements = mainContent.querySelectorAll(
    "header[style*='background-image']"
  );
  headerElements.forEach((header) => {
    if (!header.closest(".hero-carousel-wrapper")) {
      header.style.setProperty("opacity", "0", "important");
      header.style.setProperty("filter", "blur(10px)", "important");
      header.style.setProperty("will-change", "opacity, filter", "important");
    }
  });

  const allSections = Array.from(mainContent.querySelectorAll("section"));
  const sectionsToAnimate = allSections.filter((section) => {
    return !section.querySelector(".hero-carousel-wrapper");
  });

  const firstSection = sectionsToAnimate[0];
  if (firstSection) {
    const images = firstSection.querySelectorAll("img");
    images.forEach((img) => {
      if (shouldSkipElement(img)) return;

      const htmlImg = img as HTMLImageElement;
      const useTeamPhotoAnimation = isTeamPhoto(htmlImg);

      if (useTeamPhotoAnimation) {
        htmlImg.style.setProperty("opacity", "0", "important");
        htmlImg.style.setProperty("transform", "scale(0.95)", "important");
        htmlImg.style.setProperty(
          "will-change",
          "opacity, transform",
          "important"
        );
      } else {
        htmlImg.style.setProperty("opacity", "0", "important");
        htmlImg.style.setProperty("filter", "blur(10px)", "important");
        htmlImg.style.setProperty(
          "will-change",
          "opacity, filter",
          "important"
        );
      }
    });
  }
}

export default function ScrollAnimations() {
  // Store ScrollTrigger instances for proper cleanup
  const scrollTriggersRef = useRef<ScrollTrigger[]>([]);

  useEffect(() => {
    // Check for reduced motion preference - respect user accessibility settings
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // If user prefers reduced motion, skip all animations
    if (prefersReducedMotion) {
      return;
    }

    const mainContent = document.querySelector("main#main-content");
    if (!mainContent) return;

    // Set initial states IMMEDIATELY to prevent flash
    setInitialStyles(mainContent);

    // Also run on next tick to catch any late-loading images
    requestAnimationFrame(() => setInitialStyles(mainContent));

    // Wait a bit to ensure hero slider and navigation are initialized
    const initAnimations = () => {
      if (!mainContent) return;

      // Get all sections within main (including nested ones in articles, etc.)
      const allSections = Array.from(mainContent.querySelectorAll("section"));
      if (allSections.length === 0) return;

      // Filter out any sections that might be part of hero slider
      const sectionsToAnimate = allSections.filter((section) => {
        return !section.querySelector(".hero-carousel-wrapper");
      });

      // Animate header elements with background images
      animateHeaderElements(mainContent);

      // Animate the first section's images
      const firstSection = sectionsToAnimate[0];
      if (firstSection) {
        animateFirstSectionImages(firstSection);
      }

      // Animate remaining sections
      if (sectionsToAnimate.length > 1) {
        animateSections(sectionsToAnimate.slice(1));
      }

      // Animate testimonial cards
      animateTestimonialCards(mainContent);

      // Store all ScrollTrigger instances for cleanup
      scrollTriggersRef.current = ScrollTrigger.getAll();
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

      // Kill all ScrollTrigger instances we created
      scrollTriggersRef.current.forEach((trigger) => {
        try {
          trigger.kill();
        } catch {
          // Ignore errors during cleanup (trigger may already be killed)
        }
      });

      // Clear the ref
      scrollTriggersRef.current = [];

      // Also clean up any remaining ScrollTrigger instances, including testimonial cards
      ScrollTrigger.getAll().forEach((trigger) => {
        try {
          const triggerElement = trigger.trigger as Element;
          if (!triggerElement) return;

          // Skip hero carousel wrappers
          if (triggerElement.closest(".hero-carousel-wrapper")) return;

          // Kill triggers for sections
          if (triggerElement.tagName === "SECTION") {
            trigger.kill();
            return;
          }

          // Kill triggers for images
          if (triggerElement.tagName === "IMG") {
            trigger.kill();
            return;
          }

          // Kill triggers for testimonial cards (FIGURE elements with data-testimonial-card)
          if (
            triggerElement.tagName === "FIGURE" ||
            triggerElement.matches("[data-testimonial-card]") ||
            triggerElement.closest("[data-testimonial-card]")
          ) {
            trigger.kill();
            return;
          }
        } catch {
          // Ignore errors during cleanup (trigger may already be killed)
        }
      });

      // Batch refresh ScrollTrigger to ensure proper cleanup
      ScrollTrigger.refresh();
    };
  }, []);

  // No need to return style tag - we handle initial hiding via JavaScript
  // This prevents hydration mismatches
  return null;
}
