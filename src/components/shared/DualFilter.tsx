import React, { useState, useEffect } from "react";
import ProgramFilter from "./ProgramFilter";
import BeltRankFilter from "./BeltRankFilter";
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

interface DualFilterProps {
  schedule: ScheduleItem[];
}

export default function DualFilter({ schedule }: DualFilterProps) {
  const [selectedProgram, setSelectedProgram] = useState<string>("all");
  const [selectedRank, setSelectedRank] = useState<string>("all");

  // Get belt ranks available for the selected program
  const availableRanks = React.useMemo(() => {
    if (selectedProgram === "all") {
      // If all programs selected, get all unique belt ranks
      const ranks = new Set<string>();
      schedule.forEach((item) => {
        if (item.beltRank) {
          ranks.add(item.beltRank);
        }
      });
      return Array.from(ranks).sort();
    } else {
      // Filter by selected program
      const ranks = new Set<string>();
      schedule.forEach((item) => {
        if (item.className === selectedProgram && item.beltRank) {
          ranks.add(item.beltRank);
        }
      });
      const rankArray = Array.from(ranks).sort();
      // If no specific belt ranks, return appropriate default based on program
      if (rankArray.length === 0) {
        // Women's Self-Defense uses "All Classes" instead of "All Belts"
        if (selectedProgram === "Women's Self-Defense") {
          return ["All Classes"];
        }
        return ["All Belts"];
      }
      return rankArray;
    }
  }, [schedule, selectedProgram]);

  // Reset belt rank selection if current selection is not available for selected program
  useEffect(() => {
    if (
      selectedProgram !== "all" &&
      selectedRank !== "all" &&
      selectedRank !== "All Belts" &&
      selectedRank !== "All Classes"
    ) {
      if (!availableRanks.includes(selectedRank)) {
        // If program only has "All Belts" or "All Classes", set to that, otherwise reset to "all"
        if (
          availableRanks.length === 1 &&
          (availableRanks[0] === "All Belts" ||
            availableRanks[0] === "All Classes")
        ) {
          setSelectedRank(availableRanks[0]);
        } else {
          setSelectedRank("all");
        }
      }
    }
  }, [selectedProgram, availableRanks, selectedRank]);

  // Get filtered schedule for belt rank filter (only items from selected program)
  const filteredScheduleForRanks = React.useMemo(() => {
    if (selectedProgram === "all") {
      return schedule;
    }
    return schedule.filter((item) => item.className === selectedProgram);
  }, [schedule, selectedProgram]);

  // Check if there are meaningful belt ranks to filter (more than just "All Belts" or "All Classes")
  const hasMeaningfulBeltRanks = React.useMemo(() => {
    if (availableRanks.length === 0) {
      return false;
    }
    // If only one rank and it's "All Belts" or "All Classes", no meaningful filter
    if (
      availableRanks.length === 1 &&
      (availableRanks[0] === "All Belts" || availableRanks[0] === "All Classes")
    ) {
      return false;
    }
    // If there are multiple ranks, or a single rank that's not "All Belts"/"All Classes", show filter
    return true;
  }, [availableRanks]);

  const handleProgramChange = (program: string) => {
    setSelectedProgram(program);
    // Reset belt rank when program changes
    setSelectedRank("all");
  };

  useEffect(() => {
    // Store selected program in data attribute for filter logic
    const filterContainer = document.querySelector("[data-program-filter]");
    if (filterContainer) {
      filterContainer.setAttribute("data-selected-program", selectedProgram);
    }

    // Filter timetable items based on both program and belt rank
    const timetableItems = document.querySelectorAll("[data-belt-rank]");

    timetableItems.forEach((item) => {
      const itemRank = item.getAttribute("data-belt-rank");
      const itemProgram = item.getAttribute("data-program");
      let shouldShow = false;

      // Check belt rank filter (by belt colors)
      if (selectedRank === "all") {
        shouldShow = true;
      } else if (
        selectedRank === "All Belts" ||
        selectedRank === "All Classes"
      ) {
        // When "All Belts" or "All Classes" is selected, ONLY show "All Belts"/"All Classes" items
        // Do NOT show specific belt rank classes
        shouldShow = itemRank === "All Belts" || itemRank === "All Classes";
      } else if (itemRank === selectedRank) {
        // Exact match
        shouldShow = true;
      } else if (itemRank === "All Belts" || itemRank === "All Classes") {
        // "All Belts" or "All Classes" items should show for specific filter selections
        // (but NOT when "All Belts" itself is selected - handled above)
        shouldShow = true;
      } else {
        // Get belt colors for the selected filter and check if item's belt rank includes them
        const filterBeltColors = getBeltColorsForFilter(selectedRank);
        shouldShow = beltRankIncludesColors(itemRank, filterBeltColors);
      }

      // Check program filter
      if (shouldShow && selectedProgram !== "all") {
        if (itemProgram !== selectedProgram) {
          shouldShow = false;
        }
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
  }, [selectedProgram, selectedRank]);

  return (
    <div className="flex justify-center mt-4" data-program-filter>
      <div
        className={`flex max-w-lg w-full ${hasMeaningfulBeltRanks ? "" : "justify-center"}`}
      >
        <ProgramFilter
          schedule={schedule}
          selectedProgram={selectedProgram}
          onProgramChange={handleProgramChange}
          standalone={!hasMeaningfulBeltRanks}
        />
        {hasMeaningfulBeltRanks && (
          <BeltRankFilter
            schedule={filteredScheduleForRanks}
            selectedRank={selectedRank}
            onRankChange={setSelectedRank}
            isSelect={true}
            availableRanks={availableRanks}
            disabled={selectedProgram === "all"}
          />
        )}
      </div>
    </div>
  );
}
