"use client";

interface UserIconProps {
  className?: string;
  size?: number;
}

export function UserIcon({ className, size = 24 }: UserIconProps) {
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
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21C4 17.13 7.58 14 12 14C16.42 14 20 17.13 20 21" />
    </svg>
  );
}
