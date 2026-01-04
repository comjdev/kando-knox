import React, { useState, useEffect } from "react";
import beltRanksData from "../../content/belt-ranks.json";

interface ScheduleItem {
  day: string;
  timeFrom: string;
  timeTo: string;
  className: string;
  beltRank?: string | null;
  instructor?: string | null;
}

// Helper function to get belt colors for a filter selection
function getBeltColorsForFilter(filterName: string): string[] {
  const beltData = beltRanksData[filterName as keyof typeof beltRanksData];
  if (!beltData) return [];
  return beltData.map((belt) => belt.name.toLowerCase());
}

// Helper function to check if a belt rank includes any of the specified belt colors
function beltRankIncludesColors(
  beltRank: string | null,
  colors: string[]
): boolean {
  if (!beltRank || colors.length === 0) return false;

  // If "All Belts" or "All Classes", it includes all colors
  if (beltRank === "All Belts" || beltRank === "All Classes") {
    return true;
  }

  // Get the belt colors for this belt rank
  const rankBeltData = beltRanksData[beltRank as keyof typeof beltRanksData];
  if (!rankBeltData) return false;

  const rankColors = rankBeltData.map((belt) => belt.name.toLowerCase());

  // Check if any of the filter colors are in this rank's colors
  return colors.some((color) => rankColors.includes(color));
}

interface BeltRankFilterProps {
  schedule: ScheduleItem[];
  selectedRank?: string;
  onRankChange?: (rank: string) => void;
  isSelect?: boolean; // If true, render as select dropdown instead of custom dropdown
  availableRanks?: string[]; // Pre-filtered belt ranks to use instead of calculating from schedule
  disabled?: boolean; // Disable the filter (e.g., when no program is selected)
}

export default function BeltRankFilter({
  schedule,
  selectedRank: controlledRank,
  onRankChange,
  isSelect = false,
  availableRanks,
  disabled = false,
}: BeltRankFilterProps) {
  const [internalRank, setInternalRank] = useState<string>("all");
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const selectedRank =
    controlledRank !== undefined ? controlledRank : internalRank;
  const handleRankChange = (rank: string) => {
    if (onRankChange) {
      onRankChange(rank);
    } else {
      setInternalRank(rank);
    }
  };

  // Get all unique belt ranks from the schedule or use provided availableRanks
  const uniqueRanks = React.useMemo(() => {
    if (availableRanks) {
      return availableRanks;
    }
    const ranks = new Set<string>();
    schedule.forEach((item) => {
      if (item.beltRank) {
        ranks.add(item.beltRank);
      }
    });
    return Array.from(ranks).sort();
  }, [schedule, availableRanks]);

  // Check if there are meaningful belt ranks to filter
  const hasMeaningfulBeltRanks = React.useMemo(() => {
    if (uniqueRanks.length === 0) {
      return false;
    }
    // If only one rank and it's "All Belts" or "All Classes", no meaningful filter
    if (
      uniqueRanks.length === 1 &&
      (uniqueRanks[0] === "All Belts" || uniqueRanks[0] === "All Classes")
    ) {
      return false;
    }
    // If there are multiple ranks, or a single rank that's not "All Belts"/"All Classes", show filter
    return true;
  }, [uniqueRanks]);

  useEffect(() => {
    // Skip filter logic if used as select (controlled by DualFilter)
    if (isSelect && onRankChange) {
      return;
    }

    // Filter timetable items based on selected rank (by belt colors)
    const timetableItems = document.querySelectorAll("[data-belt-rank]");

    // Get belt colors for the selected filter
    const filterBeltColors =
      selectedRank === "all" ? [] : getBeltColorsForFilter(selectedRank);

    timetableItems.forEach((item) => {
      const itemRank = item.getAttribute("data-belt-rank");
      let shouldShow = false;

      if (selectedRank === "all") {
        shouldShow = true;
      } else if (itemRank === selectedRank) {
        // Exact match
        shouldShow = true;
      } else if (
        selectedRank === "All Belts" ||
        selectedRank === "All Classes"
      ) {
        // When "All Belts" or "All Classes" is selected, ONLY show "All Belts"/"All Classes" items
        // Do NOT show specific belt rank classes
        shouldShow = itemRank === "All Belts" || itemRank === "All Classes";
      } else if (itemRank === "All Belts" || itemRank === "All Classes") {
        // "All Belts" or "All Classes" items should show for specific filter selections
        // (but NOT when "All Belts" itself is selected - handled above)
        shouldShow = true;
      } else if (filterBeltColors.length > 0) {
        // Check if the item's belt rank includes any of the filter's belt colors
        shouldShow = beltRankIncludesColors(itemRank, filterBeltColors);
      } else {
        shouldShow = false;
      }

      const parentDiv = item.closest(".space-y-4");
      if (parentDiv) {
        if (shouldShow) {
          parentDiv.classList.remove("hidden");
        } else {
          parentDiv.classList.add("hidden");
        }
      }
    });

    // Hide program groups that have no visible items
    const programGroups = document.querySelectorAll(".program-group");
    programGroups.forEach((group) => {
      const visibleItems = group.querySelectorAll(".space-y-4:not(.hidden)");
      if (visibleItems.length === 0) {
        group.classList.add("hidden");
      } else {
        group.classList.remove("hidden");
      }
    });

    // Hide day columns that have no visible items
    const dayColumns = document.querySelectorAll('.grid > div[class*="px-8"]');
    dayColumns.forEach((column) => {
      const visibleItems = column.querySelectorAll(".space-y-4:not(.hidden)");
      if (visibleItems.length === 0) {
        column.classList.add("hidden");
      } else {
        column.classList.remove("hidden");
      }
    });
  }, [selectedRank, isSelect, onRankChange]);

  // Don't render if there are no meaningful belt ranks to filter
  if (!hasMeaningfulBeltRanks) {
    return null;
  }

  const getSelectedLabel = () => {
    if (selectedRank === "all") {
      return "All Classes";
    }
    return selectedRank;
  };

  const getBeltCircles = (rank: string) => {
    const beltData = beltRanksData[rank as keyof typeof beltRanksData];
    if (!beltData || beltData.length === 0) return null;

    return (
      <span className="inline-flex items-center gap-1 ml-2">
        {beltData.map((belt, index) => {
          const borderColor =
            "borderColor" in belt ? belt.borderColor : belt.color;
          return (
            <span
              key={belt.name}
              className="inline-block w-3 h-3 rounded-full border"
              style={{
                backgroundColor: belt.color,
                borderColor: borderColor,
              }}
              title={belt.name.charAt(0).toUpperCase() + belt.name.slice(1)}
            />
          );
        })}
      </span>
    );
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".belt-rank-filter-dropdown")) {
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

  if (isSelect) {
    // Render as select dropdown (for dual filter layout)
    // If only "All Belts" or "All Classes" is available, show it as the default option
    const hasOnlyDefaultOption =
      uniqueRanks.length === 1 &&
      (uniqueRanks[0] === "All Belts" || uniqueRanks[0] === "All Classes");
    const defaultOption = hasOnlyDefaultOption ? uniqueRanks[0] : null;
    const defaultLabel = defaultOption || "All Belt Ranks";

    return (
      <select
        id="belt-rank-filter"
        value={
          hasOnlyDefaultOption && selectedRank === "all"
            ? defaultOption || "all"
            : selectedRank
        }
        onChange={(e) => {
          // If "All Belts" or "All Classes" is selected and it's the only option, treat it as "all"
          const value =
            hasOnlyDefaultOption &&
            (e.target.value === "All Belts" || e.target.value === "All Classes")
              ? "all"
              : e.target.value;
          handleRankChange(value);
        }}
        disabled={disabled}
        className={`block w-full px-3 py-2.5 bg-white border border-l-0 border-gray-300 text-gray-900 text-sm rounded-r-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white shadow-sm placeholder:text-gray-400 min-w-[200px] ${
          disabled
            ? "opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-700"
            : ""
        }`}
      >
        {disabled ? (
          <option value="all">Select a program first</option>
        ) : (
          <>
            {!hasOnlyDefaultOption && (
              <option value="all">{defaultLabel}</option>
            )}
            {uniqueRanks.map((rank) => (
              <option key={rank} value={rank}>
                {rank}
              </option>
            ))}
          </>
        )}
      </select>
    );
  }

  // Original custom dropdown (for single filter layout)
  return (
    <div className="flex justify-center mt-4">
      <div className="relative belt-rank-filter-dropdown">
        <label htmlFor="belt-rank-filter" className="sr-only">
          Filter by belt rank
        </label>
        <button
          id="belt-rank-filter"
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:hover:bg-gray-700 dark:focus:ring-primary-500 dark:focus:border-primary-500 flex items-center gap-2 min-w-[350px] justify-between"
        >
          <span className="flex items-center">
            {getSelectedLabel()}
            {selectedRank !== "all" && getBeltCircles(selectedRank)}
          </span>
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
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-600 max-h-60 overflow-auto">
            <button
              onClick={() => {
                handleRankChange("all");
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${
                selectedRank === "all"
                  ? "bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400"
                  : "text-gray-900 dark:text-white"
              }`}
            >
              All Classes
            </button>
            {uniqueRanks.map((rank) => {
              const beltData =
                beltRanksData[rank as keyof typeof beltRanksData];
              return (
                <button
                  key={rank}
                  onClick={() => {
                    handleRankChange(rank);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center ${
                    selectedRank === rank
                      ? "bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400"
                      : "text-gray-900 dark:text-white"
                  }`}
                >
                  <span>{rank}</span>
                  {beltData && beltData.length > 0 && (
                    <span className="inline-flex items-center gap-1 ml-2">
                      {beltData.map((belt, index) => {
                        const borderColor =
                          "borderColor" in belt ? belt.borderColor : belt.color;
                        return (
                          <span
                            key={belt.name}
                            className="inline-block w-3 h-3 rounded-full border"
                            style={{
                              backgroundColor: belt.color,
                              borderColor: borderColor,
                            }}
                            title={
                              belt.name.charAt(0).toUpperCase() +
                              belt.name.slice(1)
                            }
                          />
                        );
                      })}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
