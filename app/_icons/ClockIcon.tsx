"use client";

interface ClockIconProps {
  className?: string;
  size?: number;
}

export function ClockIcon({ className, size = 24 }: ClockIconProps) {
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
      <circle cx="12" cy="12" r="9.5" />
      <line x1="12" y1="12" x2="12" y2="7.5" />
      <line x1="12" y1="12" x2="16" y2="12" />
      <circle cx="12" cy="12" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}
