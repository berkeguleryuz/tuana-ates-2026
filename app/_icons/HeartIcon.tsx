"use client";

interface HeartIconProps {
  className?: string;
  size?: number;
}

export function HeartIcon({ className, size = 24 }: HeartIconProps) {
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
      <path d="M12 21.35C12 21.35 3.5 15.2 3.5 9.5C3.5 7.1 5.4 5 7.8 5C9.4 5 10.9 5.9 12 7.2C13.1 5.9 14.6 5 16.2 5C18.6 5 20.5 7.1 20.5 9.5C20.5 15.2 12 21.35 12 21.35Z" />
    </svg>
  );
}
