"use client";

interface CameraIconProps {
  className?: string;
  size?: number;
}

export function CameraIcon({ className, size = 24 }: CameraIconProps) {
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
      <path d="M2 8.5C2 7.4 2.9 6.5 4 6.5H7.5L9 4.5H15L16.5 6.5H20C21.1 6.5 22 7.4 22 8.5V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V8.5Z" />
      <circle cx="12" cy="13" r="3.5" />
    </svg>
  );
}
