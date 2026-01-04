import React, { useState, useEffect } from "react";

interface CategoryFilterProps {
  categories: string[];
  selectedCategory?: string;
  onCategoryChange?: (category: string) => void;
}

export default function CategoryFilter({
  categories,
  selectedCategory: controlledCategory,
  onCategoryChange,
}: CategoryFilterProps) {
  const [internalCategory, setInternalCategory] = useState<string>("all");
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const selectedCategory =
    controlledCategory !== undefined ? controlledCategory : internalCategory;

  const handleCategoryChange = (category: string) => {
    if (onCategoryChange) {
      onCategoryChange(category);
    } else {
      setInternalCategory(category);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".category-filter-dropdown")) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Filter blog posts based on selected category
  useEffect(() => {
    const blogCards = document.querySelectorAll("[data-category]");

    blogCards.forEach((card) => {
      const cardCategoriesAttr = card.getAttribute("data-categories");
      let cardCategories: string[] = [];

      if (cardCategoriesAttr) {
        try {
          cardCategories = JSON.parse(cardCategoriesAttr);
        } catch {
          // Fallback: parse comma-separated string
          const cardCategory = card.getAttribute("data-category") || "none";
          cardCategories =
            cardCategory === "none" ? [] : cardCategory.split(",");
        }
      } else {
        // Fallback for older format
        const cardCategory = card.getAttribute("data-category") || "none";
        cardCategories = cardCategory === "none" ? [] : [cardCategory];
      }

      let shouldShow = false;

      if (selectedCategory === "all") {
        shouldShow = true;
      } else if (selectedCategory === "uncategorized") {
        // Show uncategorized posts (no categories)
        shouldShow = cardCategories.length === 0;
      } else {
        // Show posts that include the selected category
        shouldShow = cardCategories.includes(selectedCategory);
      }

      const cardElement = card as HTMLElement;
      if (shouldShow) {
        cardElement.classList.remove("hidden");
      } else {
        cardElement.classList.add("hidden");
      }
    });
  }, [selectedCategory]);

  if (categories.length === 0) {
    return null;
  }

  const getSelectedLabel = () => {
    if (selectedCategory === "all") {
      return "All Categories";
    }
    return selectedCategory;
  };

  return (
    <div className="flex justify-center mt-4">
      <div className="relative category-filter-dropdown z-50">
        <label htmlFor="category-filter" className="sr-only">
          Filter by category
        </label>
        <button
          id="category-filter"
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:hover:bg-gray-700 dark:focus:ring-primary-500 dark:focus:border-primary-500 flex items-center gap-2 min-w-[200px] justify-between relative z-50"
        >
          <span>{getSelectedLabel()}</span>
          <svg
            className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute z-[100] w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-600 max-h-60 overflow-auto">
            <button
              onClick={() => {
                handleCategoryChange("all");
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${
                selectedCategory === "all"
                  ? "bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400"
                  : "text-gray-900 dark:text-white"
              }`}
            >
              All Categories
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  handleCategoryChange(category);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  selectedCategory === category
                    ? "bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400"
                    : "text-gray-900 dark:text-white"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
