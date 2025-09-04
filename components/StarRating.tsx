'use client';

import { useState } from 'react';
import { HiStar } from 'react-icons/hi2';

interface StarRatingProps {
  rating: number;
  onChange: (rating: number) => void;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

export default function StarRating({ 
  rating, 
  onChange, 
  maxRating = 10, 
  size = 'md',
  disabled = false 
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const handleClick = (value: number) => {
    if (!disabled) {
      onChange(value);
    }
  };

  const handleMouseEnter = (value: number) => {
    if (!disabled) {
      setHoverRating(value);
    }
  };

  const handleMouseLeave = () => {
    if (!disabled) {
      setHoverRating(0);
    }
  };

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: maxRating }, (_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= (hoverRating || rating);
        
        return (
          <button
            key={starValue}
            type="button"
            onClick={() => handleClick(starValue)}
            onMouseEnter={() => handleMouseEnter(starValue)}
            onMouseLeave={handleMouseLeave}
            disabled={disabled}
            className={`${disabled ? 'cursor-default' : 'cursor-pointer hover:scale-110'} transition-all duration-150`}
          >
            <HiStar 
              className={`${sizeClasses[size]} ${
                isFilled ? 'text-yellow-400' : 'text-gray-300'
              } transition-colors duration-150`}
            />
          </button>
        );
      })}
      <span className="ml-2 text-sm font-medium text-gray-700">
        {rating}/{maxRating}
      </span>
    </div>
  );
}