import React, { useState, useEffect } from "react";
import beltRanksData from "../../content/belt-ranks.json";

interface ScheduleItem {
  day: string;
  timeFrom: string;
  timeTo: string;
  className: string;
  beltRank?: string | null;
  instructor?: string;
}

interface BeltRankFilterProps {
  schedule: ScheduleItem[];
}

export default function BeltRankFilter({ schedule }: BeltRankFilterProps) {
  const [selectedRank, setSelectedRank] = useState<string>("all");
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // Get all unique belt ranks from the schedule
  const uniqueRanks = React.useMemo(() => {
    const ranks = new Set<string>();
    schedule.forEach((item) => {
      if (item.beltRank) {
        ranks.add(item.beltRank);
      }
    });
    return Array.from(ranks).sort();
  }, [schedule]);

  useEffect(() => {
    // Filter timetable items based on selected rank
    const timetableItems = document.querySelectorAll("[data-belt-rank]");

    timetableItems.forEach((item) => {
      const itemRank = item.getAttribute("data-belt-rank");
      let shouldShow = false;

      if (selectedRank === "all") {
        shouldShow = true;
      } else if (itemRank === selectedRank) {
        shouldShow = true;
      } else if (
        selectedRank === "Advanced" &&
        itemRank === "Junior Advanced"
      ) {
        // Include Junior Advanced when filtering for Advanced (both include black belts)
        shouldShow = true;
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
  }, [selectedRank]);

  if (uniqueRanks.length === 0) {
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
          className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:hover:bg-gray-700 dark:focus:ring-primary-500 dark:focus:border-primary-500 flex items-center gap-2 min-w-[200px] justify-between"
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
                setSelectedRank("all");
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
                    setSelectedRank(rank);
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
