"use client";

interface CalendarIconProps {
  className?: string;
  size?: number;
}

export function CalendarIcon({ className, size = 24 }: CalendarIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="3" y="6" width="18" height="15" rx="2.5" />
      <line x1="8" y1="3.5" x2="8" y2="7.5" />
      <line x1="16" y1="3.5" x2="16" y2="7.5" />
      <line x1="3" y1="11" x2="21" y2="11" />
      <circle cx="8" cy="15.5" r="0.8" fill="currentColor" stroke="none" />
      <circle cx="12" cy="15.5" r="0.8" fill="currentColor" stroke="none" />
      <circle cx="16" cy="15.5" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  );
}
