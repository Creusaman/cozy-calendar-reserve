
import * as React from "react";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface CounterProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  label: string;
  className?: string;
}

export function PersonCounter({
  value,
  onChange,
  min = 0,
  max = 10,
  label,
  className,
}: CounterProps) {
  const handleIncrement = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  const handleDecrement = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  return (
    <div className={cn("flex items-center justify-between", className)}>
      <span className="text-sm">{label}</span>
      <div className="counter-input">
        <button
          type="button"
          onClick={handleDecrement}
          disabled={value <= min}
          className={cn(
            value <= min && "opacity-50 cursor-not-allowed"
          )}
          aria-label="Decrease"
        >
          <Minus className="h-3 w-3" />
        </button>
        <span className="text-sm font-medium">{value}</span>
        <button
          type="button"
          onClick={handleIncrement}
          disabled={value >= max}
          className={cn(
            value >= max && "opacity-50 cursor-not-allowed"
          )}
          aria-label="Increase"
        >
          <Plus className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}
