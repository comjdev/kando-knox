import React from "react";

interface PrimaryButtonProps {
  href?: string;
  type?: "button" | "submit" | "reset";
  className?: string;
  target?: string;
  rel?: string;
  onClick?: () => void;
  children: React.ReactNode;
}

export default function PrimaryButton({
  href,
  type = "button",
  className = "",
  target,
  rel,
  onClick,
  children,
}: PrimaryButtonProps) {
  const baseClasses =
    "inline-block text-white bg-primary-500 dark:bg-primary-600 hover:bg-primary-600 dark:hover:bg-primary-700 focus:ring-4 focus:ring-primary-500 shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none transition-colors";
  const combinedClasses = `${baseClasses} ${className}`.trim();

  if (href) {
    return React.createElement(
      "a",
      { href, className: combinedClasses, target, rel, onClick },
      children
    );
  }

  return React.createElement(
    "button",
    { type, className: combinedClasses, onClick },
    children
  );
}
