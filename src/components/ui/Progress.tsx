import React from 'react';
import { cn } from '../../lib/utils';

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  indicatorColor?: string;
}

export function Progress({ className, value = 0, indicatorColor, ...props }: ProgressProps) {
  const percent = Math.min(100, Math.max(0, value));
  
  return (
    <div
      className={cn("relative h-4 w-full overflow-hidden rounded-full bg-secondary/30", className)}
      {...props}
    >
      <div
        className={cn("h-full w-full flex-1 transition-all duration-500 ease-in-out bg-primary", indicatorColor)}
        style={{ transform: `translateX(-${100 - percent}%)` }}
      />
    </div>
  );
}
