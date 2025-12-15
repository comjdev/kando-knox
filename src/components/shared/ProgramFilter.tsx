import React, { useState, useEffect } from "react";

interface ScheduleItem {
  day: string;
  timeFrom: string;
  timeTo: string;
  className: string;
  beltRank?: string | null;
  instructor?: string;
}

interface ProgramFilterProps {
  schedule: ScheduleItem[];
  selectedProgram: string;
  onProgramChange: (program: string) => void;
  standalone?: boolean; // If true, button should be rounded on all sides (no belt rank filter)
}

export default function ProgramFilter({
  schedule,
  selectedProgram,
  onProgramChange,
  standalone = false,
}: ProgramFilterProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Get all unique program names (className) from the schedule
  const uniquePrograms = React.useMemo(() => {
    const programs = new Set<string>();
    schedule.forEach((item) => {
      if (item.className) {
        programs.add(item.className);
      }
    });
    return Array.from(programs).sort();
  }, [schedule]);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        setIsOpen(false);
      }
    };

    // Use a small delay to ensure the click event that opened the dropdown has finished
    const timeoutId = setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside, true);
    }, 10);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("mousedown", handleClickOutside, true);
    };
  }, [isOpen]);

  // Reset dropdown state when component mounts or program changes
  useEffect(() => {
    setIsOpen(false);
  }, [selectedProgram]);

  if (uniquePrograms.length === 0) {
    return null;
  }

  return (
    <div className="relative program-filter-dropdown" ref={dropdownRef}>
      <button
        id="program-filter-button"
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className={`inline-flex items-center shrink-0 z-10 text-sm font-medium text-gray-900 bg-white border border-gray-300 hover:bg-gray-50 focus:ring-4 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:hover:bg-gray-700 dark:focus:ring-primary-500 dark:focus:border-primary-500 px-4 py-2.5 focus:outline-none min-w-[250px] justify-between ${
          standalone ? "rounded-lg" : "border-r-0 rounded-l-lg"
        }`}
      >
        <span className="flex items-center">
          <svg
            className="w-4 h-4 me-1.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
          {selectedProgram === "all" ? "All Programs" : selectedProgram}
        </span>
        <svg
          className={`w-4 h-4 ms-1.5 transition-transform ${
            isOpen ? "rotate-180" : ""
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
            strokeWidth={2}
            d="m19 9-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-600 max-h-60 overflow-auto">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onProgramChange("all");
              setIsOpen(false);
            }}
            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center ${
              selectedProgram === "all"
                ? "bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400"
                : "text-gray-900 dark:text-white"
            }`}
          >
            All Programs
          </button>
          {uniquePrograms.map((program) => (
            <button
              key={program}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onProgramChange(program);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${
                selectedProgram === program
                  ? "bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400"
                  : "text-gray-900 dark:text-white"
              }`}
            >
              {program}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
