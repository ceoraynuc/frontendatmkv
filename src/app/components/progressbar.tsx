interface ProgressBarProps {
  percent: number;
  label: string; // read out by screen readers
  size?: "sm" | "md";
}

export function ProgressBar({ percent, label, size = "md" }: ProgressBarProps) {
  return (
    <div
      role="progressbar"
      aria-valuenow={percent}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      className={`w-full ${size === "sm" ? "h-1.5" : "h-2"} bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden`}
    >
      <div
        className="h-full bg-primary-600 dark:bg-primary-350 rounded-full transition-all"
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}