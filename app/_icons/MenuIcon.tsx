"use client";

interface MenuIconProps {
  className?: string;
  size?: number;
}

export function MenuIcon({ className, size = 24 }: MenuIconProps) {
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
      <line x1="4" y1="7" x2="20" y2="7" />
      <line x1="4" y1="12" x2="17" y2="12" />
      <line x1="4" y1="17" x2="14" y2="17" />
    </svg>
  );
}
