import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function ScrollAnimations() {
  useEffect(() => {
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    // Wait a bit to ensure hero slider and navigation are initialized
    const initAnimations = () => {
      // Only target sections that are direct children of main, excluding hero section
      // Use very specific selector to avoid conflicts with hero slider and navigation
      const mainContent = document.querySelector("main#main-content");
      if (!mainContent) return;

      // Get all sections except the first one (hero)
      const sections = Array.from(mainContent.querySelectorAll("section")).slice(1);

      if (sections.length === 0) {
        return;
      }

      // Filter out any sections that might be part of hero slider
      const sectionsToAnimate = sections.filter((section) => {
        // Exclude hero section and any section containing hero carousel
        const hasHeroCarousel = section.querySelector(".hero-carousel-wrapper");
        return !hasHeroCarousel;
      });

      sectionsToAnimate.forEach((section) => {
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
        // Only kill triggers that we created (check if they're for our sections)
        const triggerElement = trigger.trigger;
        if (triggerElement && triggerElement.tagName === "SECTION") {
          const hasHeroCarousel = triggerElement.querySelector(".hero-carousel-wrapper");
          if (!hasHeroCarousel) {
            trigger.kill();
          }
        }
      });
    };
  }, []);

  return null; // This component doesn't render anything
}
