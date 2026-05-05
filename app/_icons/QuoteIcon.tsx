"use client";

interface QuoteIconProps {
  className?: string;
  size?: number;
}

export function QuoteIcon({ className, size = 24 }: QuoteIconProps) {
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
      <path d="M4 17.5C4 14.5 5.5 10 10 7.5L9 9.5C6.5 11 5.5 13.5 5.5 15.5H8.5C9.33 15.5 10 16.17 10 17V19.5C10 20.33 9.33 21 8.5 21H5.5C4.67 21 4 20.33 4 19.5V17.5Z" />
      <path d="M14 17.5C14 14.5 15.5 10 20 7.5L19 9.5C16.5 11 15.5 13.5 15.5 15.5H18.5C19.33 15.5 20 16.17 20 17V19.5C20 20.33 19.33 21 18.5 21H15.5C14.67 21 14 20.33 14 19.5V17.5Z" />
    </svg>
  );
}
