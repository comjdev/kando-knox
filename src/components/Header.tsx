import React, { useState, useEffect } from "react";
import Logo from "./shared/Logo";
import { PROGRAMS, SITE_CONFIG } from "../config";
import PrimaryButton from "./shared/PrimaryButton";

export default function Header() {
  // Always initialize with "light" to prevent hydration mismatch
  // Theme will be synced in useEffect after hydration
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Mark as mounted to prevent hydration mismatch
    setMounted(true);

    // Throttle scroll handler using requestAnimationFrame for better performance
    let rafId: number | null = null;
    let lastScrollY = window.scrollY;

    // Sync theme state with DOM and ensure consistency
    const syncTheme = () => {
      try {
        // Always check localStorage first to ensure persistence
        const savedTheme = localStorage.getItem("theme") as
          | "light"
          | "dark"
          | null;

        if (savedTheme) {
          // Use saved theme and ensure DOM matches
          setTheme(savedTheme);
          document.documentElement.classList.remove("light", "dark");
          document.documentElement.classList.add(savedTheme);
          return;
        }

        // Check if HTML element already has theme class (set by inline script)
        const htmlHasDark = document.documentElement.classList.contains("dark");
        const htmlHasLight =
          document.documentElement.classList.contains("light");
        if (htmlHasDark || htmlHasLight) {
          const initialTheme = htmlHasDark ? "dark" : "light";
          setTheme(initialTheme);
          // Save to localStorage for persistence
          localStorage.setItem("theme", initialTheme);
          return;
        }

        // Fallback to system preference
        const systemPrefersDark = window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches;
        const initialTheme = systemPrefersDark ? "dark" : "light";
        setTheme(initialTheme);
        document.documentElement.classList.remove("light", "dark");
        document.documentElement.classList.add(initialTheme);
        // Save to localStorage for persistence
        localStorage.setItem("theme", initialTheme);
      } catch (e) {
        // If localStorage is not available, use system preference
        const systemPrefersDark = window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches;
        const initialTheme = systemPrefersDark ? "dark" : "light";
        setTheme(initialTheme);
        document.documentElement.classList.remove("light", "dark");
        document.documentElement.classList.add(initialTheme);
      }
    };

    syncTheme();

    // Handle scroll event - throttled using requestAnimationFrame
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      // Only update if scroll position actually changed
      if (currentScrollY !== lastScrollY) {
        setIsScrolled(currentScrollY > 0);
        lastScrollY = currentScrollY;
      }
    };

    // Throttled scroll handler
    const throttledScrollHandler = () => {
      if (rafId === null) {
        rafId = requestAnimationFrame(() => {
          handleScroll();
          rafId = null;
        });
      }
    };

    // Set initial scroll state after mount to prevent hydration mismatch
    handleScroll();
    window.addEventListener("scroll", throttledScrollHandler, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", throttledScrollHandler);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, []);

  // Separate effect for closing menus on scroll and resize
  useEffect(() => {
    let scrollRafId: number | null = null;
    let resizeTimeoutId: NodeJS.Timeout | null = null;

    // Close mobile menu on scroll (common mobile UX pattern)
    // Throttled to avoid excessive state updates
    const handleScrollCloseMenu = () => {
      if (scrollRafId === null) {
        scrollRafId = requestAnimationFrame(() => {
          setIsMobileMenuOpen((prev) => {
            if (prev) {
              setIsDropdownOpen(false);
              return false;
            }
            return prev;
          });
          scrollRafId = null;
        });
      }
    };

    // Close menus when viewport changes (e.g., device rotation)
    // Debounced to avoid excessive calls during resize
    const handleResize = () => {
      if (resizeTimeoutId) {
        clearTimeout(resizeTimeoutId);
      }

      resizeTimeoutId = setTimeout(() => {
        // Close mobile menu if viewport becomes desktop size
        if (window.innerWidth >= 768) {
          setIsMobileMenuOpen((prev) => {
            if (prev) {
              setIsDropdownOpen(false);
              return false;
            }
            return prev;
          });
        }
        resizeTimeoutId = null;
      }, 150); // 150ms debounce
    };

    window.addEventListener("scroll", handleScrollCloseMenu, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScrollCloseMenu);
      window.removeEventListener("resize", handleResize);
      if (scrollRafId !== null) {
        cancelAnimationFrame(scrollRafId);
      }
      if (resizeTimeoutId) {
        clearTimeout(resizeTimeoutId);
      }
    };
  }, []);

  useEffect(() => {
    // Close dropdown and mobile menu when clicking outside
    // Use both click and touchstart for better mobile support
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as HTMLElement;
      const dropdown = document.getElementById("mega-menu-full-cta-dropdown");
      const button = document.getElementById(
        "mega-menu-full-cta-dropdown-button"
      );
      const mobileMenu = document.getElementById("mega-menu-full-cta");
      const mobileMenuButton = document.querySelector(
        '[data-collapse-toggle="mega-menu-full-cta"]'
      );

      // Check if click is on a link inside the dropdown (should not close)
      const clickedLink = target.closest("a");
      if (clickedLink && dropdown?.contains(clickedLink)) {
        return;
      }

      // Don't close if click is from the hero slider buttons (user clicking slider controls)
      // But allow closing if clicking elsewhere in the slider area
      const carouselButton = target.closest(".carousel .prev, .carousel .next");
      if (carouselButton) {
        return; // Don't close when user clicks slider buttons
      }

      // Close dropdown if clicking outside
      if (
        isDropdownOpen &&
        dropdown &&
        button &&
        !dropdown.contains(target) &&
        !button.contains(target)
      ) {
        setIsDropdownOpen(false);
      }

      // Close mobile menu if clicking outside (mobile only)
      if (
        isMobileMenuOpen &&
        mobileMenu &&
        mobileMenuButton &&
        !mobileMenu.contains(target) &&
        !mobileMenuButton.contains(target) &&
        window.innerWidth < 768
      ) {
        setIsMobileMenuOpen(false);
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen || isMobileMenuOpen) {
      // Use both click and touchstart for better mobile support
      // Add small delay for touchstart to allow click events to fire first
      document.addEventListener("click", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside, {
        passive: true,
      });
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isDropdownOpen, isMobileMenuOpen]);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(newTheme);
  };

  const closeMenus = (e?: React.MouseEvent) => {
    // Don't prevent default - let the link navigate normally
    setIsMobileMenuOpen(false);
    setIsDropdownOpen(false);
  };

  const ThemeToggleButton = ({ className = "" }: { className?: string }) => (
    <button
      onClick={toggleTheme}
      className={`inline-flex items-center justify-center p-2.5 w-10 h-10 text-heading bg-neutral-secondary-soft rounded-lg hover:bg-neutral-secondary hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors cursor-pointer ${className}`}
      aria-label="Toggle dark mode"
      type="button"
    >
      {mounted && theme === "light" ? (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      ) : mounted && theme === "dark" ? (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M12 8a4 4 0 1 0 0 8 4 4 0 1 0 0-8z"
          />
        </svg>
      ) : (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      )}
    </button>
  );

  return (
    <nav
      className={`sticky top-0 z-[1100] border-default transition-all ${
        mounted && isScrolled
          ? "bg-white dark:bg-gray-800 shadow-sm"
          : "bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm"
      }`}
    >
      <div className="flex flex-wrap justify-between items-center mx-auto max-w-7xl p-4">
        <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <Logo className="h-16" />
        </a>
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggleButton />
          <button
            data-collapse-toggle="mega-menu-full-cta"
            type="button"
            onClick={() => {
              setIsMobileMenuOpen(!isMobileMenuOpen);
              if (!isMobileMenuOpen) {
                setIsDropdownOpen(false);
              }
            }}
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-body rounded-lg hover:bg-neutral-secondary-soft hover:text-heading focus:outline-none focus:ring-2 focus:ring-default"
            aria-controls="mega-menu-full-cta"
            aria-expanded={isMobileMenuOpen}
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-6 h-6"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="2"
                d="M5 7h14M5 12h14M5 17h14"
              />
            </svg>
          </button>
        </div>
        <div
          id="mega-menu-full-cta"
          className={`items-center justify-between w-full md:flex md:w-auto md:order-1 md:relative ${
            isMobileMenuOpen ? "flex" : "hidden"
          }`}
        >
          <ul className="flex flex-col font-medium md:flex-row md:mt-0 md:space-x-8 rtl:space-x-reverse absolute md:relative top-full left-0 right-0 md:top-auto md:left-auto md:right-auto bg-white dark:bg-gray-800 md:bg-transparent shadow-lg md:shadow-none border-b border-light md:border-0 z-[1100] md:z-auto">
            <li>
              <button
                id="mega-menu-full-cta-dropdown-button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center justify-between w-full py-2 px-3 font-medium text-heading border-b border-light md:w-auto hover:bg-neutral-secondary-soft hover:text-primary md:hover:bg-transparent md:border-0 md:hover:text-primary md:p-0 cursor-pointer"
                aria-expanded={isDropdownOpen}
                aria-haspopup="true"
              >
                Programs
                <svg
                  className={`w-4 h-4 ms-1.5 transition-transform ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m19 9-7 7-7-7"
                  />
                </svg>
              </button>
              {/* Mobile program links - shown when dropdown is open */}
              {isDropdownOpen && (
                <ul className="md:hidden pl-8 mt-2 space-y-2 border-l-2 border-light">
                  {PROGRAMS.map((program) => (
                    <li key={program.href}>
                      <a
                        href={program.href}
                        onClick={(e) => {
                          closeMenus(e);
                          // Ensure navigation happens - don't prevent default
                        }}
                        className="block py-2 px-3 text-heading hover:text-primary hover:bg-neutral-secondary-soft rounded"
                      >
                        {program.label}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </li>
            <li>
              <a
                href="/about"
                onClick={(e) => {
                  closeMenus(e);
                }}
                className="block py-2 px-3 text-heading hover:text-primary border-b border-light hover:bg-neutral-secondary-soft md:hover:bg-transparent md:border-0 md:hover:text-primary md:p-0"
              >
                About
              </a>
            </li>
            <li>
              <a
                href="/blog"
                onClick={(e) => {
                  closeMenus(e);
                }}
                className="block py-2 px-3 text-heading hover:text-primary border-b border-light hover:bg-neutral-secondary-soft md:hover:bg-transparent md:border-0 md:hover:text-primary md:p-0"
              >
                Blog
              </a>
            </li>
            <li>
              <a
                href={SITE_CONFIG.academyUrl}
                target="_blank"
                onClick={(e) => {
                  closeMenus(e);
                }}
                className="block py-2 px-3 text-heading hover:text-primary border-b border-light hover:bg-neutral-secondary-soft md:hover:bg-transparent md:border-0 md:hover:text-primary md:p-0"
              >
                Academy
              </a>
            </li>
            <li>
              <a
                href={SITE_CONFIG.shopUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  closeMenus(e);
                  // External link - let browser handle it
                }}
                className="block py-2 px-3 text-heading hover:text-primary border-b border-light hover:bg-neutral-secondary-soft md:hover:bg-transparent md:border-0 md:hover:text-primary md:p-0"
              >
                Shop
              </a>
            </li>
            <li>
              <a
                href="/contact"
                onClick={(e) => {
                  closeMenus(e);
                }}
                className="block py-2 px-3 text-heading hover:text-primary border-b border-light hover:bg-neutral-secondary-soft md:hover:bg-transparent md:border-0 md:hover:text-primary md:p-0"
              >
                Contact
              </a>
            </li>
            <li className="mt-4 mb-4 px-3 md:hidden">
              <PrimaryButton
                href="#footer-book-trial"
                onClick={closeMenus}
                className="w-full text-center justify-center"
              >
                Book a trial
              </PrimaryButton>
            </li>
          </ul>
        </div>
        <div className="hidden md:flex md:order-2 md:items-center md:gap-3">
          <ThemeToggleButton />
          <PrimaryButton href="#footer-book-trial">Book a trial</PrimaryButton>
        </div>
      </div>
      <div
        id="mega-menu-full-cta-dropdown"
        className={`${
          isDropdownOpen ? "hidden md:block" : "hidden"
        } absolute top-full left-0 right-0 z-[1100] bg-neutral-primary-soft border-default shadow-xs border-y`}
      >
        <div className="grid max-w-7xl px-4 py-5 mx-auto text-sm text-body md:grid-cols-3 md:px-6">
          {/* Left column - Martial Arts */}
          <div className="mb-4 md:mb-0">
            <h3 className="mb-3 font-semibold text-heading">
              Martial Arts & Karate
            </h3>
            <ul className="space-y-3">
              {PROGRAMS.filter(
                (program) => program.group === "Martial Arts"
              ).map((program) => (
                <li key={program.href}>
                  <a
                    href={program.href}
                    onClick={closeMenus}
                    className="block hover:text-primary group"
                  >
                    <span className="font-medium group-hover:underline">
                      {program.label}
                    </span>
                    {program.description && (
                      <p className="hidden md:block text-xs text-body mt-1">
                        {program.description}
                      </p>
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Middle column - BJJ and Self-Defence */}
          <div className="mb-4 md:mb-0">
            {PROGRAMS.filter(
              (program) => program.group === "Brazilian Jiu-Jitsu"
            ).length > 0 && (
              <div className="mb-6">
                <h3 className="mb-3 font-semibold text-heading">
                  Brazilian Jiu-Jitsu
                </h3>
                <ul className="space-y-3">
                  {PROGRAMS.filter(
                    (program) => program.group === "Brazilian Jiu-Jitsu"
                  ).map((program) => (
                    <li key={program.href}>
                      <a
                        href={program.href}
                        onClick={() => {
                          setIsDropdownOpen(false);
                        }}
                        className="block hover:text-primary group"
                      >
                        <span className="font-medium group-hover:underline">
                          {program.label}
                        </span>
                        {program.description && (
                          <p className="hidden md:block text-xs text-body mt-1">
                            {program.description}
                          </p>
                        )}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {PROGRAMS.filter((program) => program.group === "Self-Defence")
              .length > 0 && (
              <div>
                <h3 className="mb-3 font-semibold text-heading">
                  Self-Defence
                </h3>
                <ul className="space-y-3">
                  {PROGRAMS.filter(
                    (program) => program.group === "Self-Defence"
                  ).map((program) => (
                    <li key={program.href}>
                      <a
                        href={program.href}
                        onClick={() => {
                          setIsDropdownOpen(false);
                        }}
                        className="block hover:text-primary group"
                      >
                        <span className="font-medium group-hover:underline">
                          {program.label}
                        </span>
                        {program.description && (
                          <p className="hidden md:block text-xs text-body mt-1">
                            {program.description}
                          </p>
                        )}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Right column - Our Programs */}
          <div className="mt-4 md:mt-0">
            <h2 className="mb-2.5 font-semibold text-heading">Our Programs</h2>
            <p className="mb-2.5 text-body">
              At Kando Martial Arts Knox, we offer a variety of programs
              designed for all ages and skill levels. From kids to adults, find
              the perfect program to build confidence, strength, and discipline.
            </p>
            <a
              href="/timetable"
              onClick={closeMenus}
              className="inline-flex items-center text-sm font-medium text-primary hover:underline"
            >
              View timetable
              <span className="sr-only">View timetable</span>
              <svg
                className="w-4 h-4 ms-1.5 rtl:rotate-180"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 12H5m14 0-4 4m4-4-4-4"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
