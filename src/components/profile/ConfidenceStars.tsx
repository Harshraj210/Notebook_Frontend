import React from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

type Props = {
  rating: number; // 0-5
  size?: number;
  className?: string;
};

const ConfidenceStars = ({ rating, size = 14, className }: Props) => {
  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={size}
          className={cn(
            "transition-colors duration-200",
            i < rating
              ? "fill-indigo-500 text-indigo-500"
              : "fill-transparent text-zinc-700"
          )}
        />
      ))}
    </div>
  );
};

export default ConfidenceStars;
