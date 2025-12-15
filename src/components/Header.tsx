import React, { useState, useEffect } from "react";
import Logo from "./shared/Logo";
import { PROGRAMS, SITE_CONFIG } from "../config";
import PrimaryButton from "./shared/PrimaryButton";

export default function Header() {
  // Initialize theme from DOM (set by inline script) or localStorage to prevent flash
  const getInitialTheme = (): "light" | "dark" => {
    if (typeof document !== "undefined") {
      // Check if HTML element already has theme class (set by inline script)
      const htmlClass = document.documentElement.classList.contains("dark")
        ? "dark"
        : document.documentElement.classList.contains("light")
          ? "light"
          : null;
      if (htmlClass) return htmlClass;

      // Fallback to localStorage or system preference
      const savedTheme = localStorage.getItem("theme") as
        | "light"
        | "dark"
        | null;
      if (savedTheme) return savedTheme;

      const systemPrefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      return systemPrefersDark ? "dark" : "light";
    }
    return "light";
  };

  const [theme, setTheme] = useState<"light" | "dark">(getInitialTheme);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    // Sync theme state with DOM and ensure consistency
    const syncTheme = () => {
      const savedTheme = localStorage.getItem("theme") as
        | "light"
        | "dark"
        | null;
      const systemPrefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      const initialTheme = savedTheme || (systemPrefersDark ? "dark" : "light");

      setTheme(initialTheme);
      document.documentElement.classList.remove("light", "dark");
      document.documentElement.classList.add(initialTheme);
    };

    syncTheme();

    // Sync theme during ViewTransitions
    const handlePageLoad = () => {
      // Read from DOM first (set by inline script)
      const htmlHasDark = document.documentElement.classList.contains("dark");
      const htmlHasLight = document.documentElement.classList.contains("light");
      if (htmlHasDark || htmlHasLight) {
        setTheme(htmlHasDark ? "dark" : "light");
      } else {
        syncTheme();
      }
    };

    document.addEventListener("astro:page-load", handlePageLoad);

    // Handle scroll event
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("astro:page-load", handlePageLoad);
    };
  }, []);

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const dropdown = document.getElementById("mega-menu-full-cta-dropdown");
      const button = document.getElementById(
        "mega-menu-full-cta-dropdown-button"
      );

      if (
        isDropdownOpen &&
        dropdown &&
        button &&
        !dropdown.contains(target) &&
        !button.contains(target)
      ) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(newTheme);
  };

  return (
    <nav
      className={`sticky top-0 z-[1100] border-default transition-all ${
        isScrolled
          ? "bg-white dark:bg-gray-800 shadow-sm"
          : "bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm"
      }`}
    >
      <div className="flex flex-wrap justify-between items-center mx-auto max-w-7xl p-4">
        <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <Logo className="h-16" />
        </a>
        <button
          data-collapse-toggle="mega-menu-full-cta"
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-body rounded-lg md:hidden hover:bg-neutral-secondary-soft hover:text-heading focus:outline-none focus:ring-2 focus:ring-default"
          aria-controls="mega-menu-full-cta"
          aria-expanded="false"
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
        <div
          id="mega-menu-full-cta"
          className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
        >
          <ul className="flex flex-col mt-4 font-medium md:flex-row md:mt-0 md:space-x-8 rtl:space-x-reverse">
            <li>
              <button
                id="mega-menu-full-cta-dropdown-button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center justify-between w-full py-2 px-3 font-medium text-heading border-b border-light md:w-auto hover:bg-neutral-secondary-soft hover:text-primary md:hover:bg-transparent md:border-0 md:hover:text-primary md:p-0"
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
            </li>
            <li>
              <a
                href="/about"
                className="block py-2 px-3 text-heading hover:text-primary border-b border-light hover:bg-neutral-secondary-soft md:hover:bg-transparent md:border-0 md:hover:text-primary md:p-0"
              >
                About
              </a>
            </li>
            <li>
              <a
                href="/blog"
                className="block py-2 px-3 text-heading hover:text-primary border-b border-light hover:bg-neutral-secondary-soft md:hover:bg-transparent md:border-0 md:hover:text-primary md:p-0"
              >
                Blog
              </a>
            </li>
            <li>
              <a
                href="/academy"
                className="block py-2 px-3 text-heading hover:text-primary border-b border-light hover:bg-neutral-secondary-soft md:hover:bg-transparent md:border-0 md:hover:text-primary md:p-0"
              >
                Academy
              </a>
            </li>
            <li>
              <a
                href={SITE_CONFIG.shopUrl}
                target="_blank"
                className="block py-2 px-3 text-heading hover:text-primary border-b border-light hover:bg-neutral-secondary-soft md:hover:bg-transparent md:border-0 md:hover:text-primary md:p-0"
              >
                Shop
              </a>
            </li>
            <li>
              <a
                href="/contact"
                className="block py-2 px-3 text-heading hover:text-primary border-b border-light hover:bg-neutral-secondary-soft md:hover:bg-transparent md:border-0 md:hover:text-primary md:p-0"
              >
                Contact
              </a>
            </li>
          </ul>
        </div>
        <div className="hidden md:flex md:order-2 md:items-center md:gap-3">
          <button
            onClick={toggleTheme}
            className="inline-flex items-center justify-center p-2.5 w-10 h-10 text-heading bg-neutral-secondary-soft rounded-lg hover:bg-neutral-secondary hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
            aria-label="Toggle dark mode"
            type="button"
          >
            {theme === "light" ? (
              // Moon icon for dark mode
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
            ) : (
              // Sun icon for light mode
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
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            )}
          </button>
          <PrimaryButton href="/contact">Book a trial</PrimaryButton>
        </div>
      </div>
      <div
        id="mega-menu-full-cta-dropdown"
        className={`${
          isDropdownOpen ? "block" : "hidden"
        } absolute top-full left-0 right-0 z-[1100] mt-1 bg-neutral-primary-soft border-default shadow-xs border-y`}
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
                    onClick={() => setIsDropdownOpen(false)}
                    className="block hover:text-primary group"
                  >
                    <span className="font-medium group-hover:underline">
                      {program.label}
                    </span>
                    {program.description && (
                      <p className="text-xs text-body mt-1">
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
                        onClick={() => setIsDropdownOpen(false)}
                        className="block hover:text-primary group"
                      >
                        <span className="font-medium group-hover:underline">
                          {program.label}
                        </span>
                        {program.description && (
                          <p className="text-xs text-body mt-1">
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
                        onClick={() => setIsDropdownOpen(false)}
                        className="block hover:text-primary group"
                      >
                        <span className="font-medium group-hover:underline">
                          {program.label}
                        </span>
                        {program.description && (
                          <p className="text-xs text-body mt-1">
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
              onClick={() => setIsDropdownOpen(false)}
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
