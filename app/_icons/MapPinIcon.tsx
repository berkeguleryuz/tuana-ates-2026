"use client";

interface MapPinIconProps {
  className?: string;
  size?: number;
}

export function MapPinIcon({ className, size = 24 }: MapPinIconProps) {
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
      <path d="M12 2.5C8.13 2.5 5 5.63 5 9.5C5 14.28 12 21.5 12 21.5C12 21.5 19 14.28 19 9.5C19 5.63 15.87 2.5 12 2.5Z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </svg>
  );
}
