
import { useState } from "react";
import { Star } from "lucide-react";

interface StarRatingProps {
  value: number;
  onChange?: (rating: number) => void;
  readonly?: boolean;
  size?: "sm" | "md" | "lg";
}

const StarRating: React.FC<StarRatingProps> = ({
  value,
  onChange,
  readonly = false,
  size = "md",
}) => {
  const [hoverRating, setHoverRating] = useState(0);

  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  const handleClick = (rating: number) => {
    if (!readonly && onChange) {
      // Toggle functionality: if clicking the same rating, reset to 0
      onChange(rating === value ? 0 : rating);
    }
  };

  const handleMouseEnter = (rating: number) => {
    if (!readonly) {
      setHoverRating(rating);
    }
  };

  const handleMouseLeave = () => {
    if (!readonly) {
      setHoverRating(0);
    }
  };

  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => handleClick(star)}
          onMouseEnter={() => handleMouseEnter(star)}
          onMouseLeave={handleMouseLeave}
          className={`${
            readonly ? "cursor-default" : "cursor-pointer"
          } transition-colors duration-200 p-0.5`}
          disabled={readonly}
          aria-label={`Rate ${star} out of 5 stars`}
        >
          <Star
            className={`
              ${sizeClasses[size]} 
              ${
                (hoverRating ? star <= hoverRating : star <= value)
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300 dark:text-gray-600"
              }
              transition-colors duration-200
            `}
          />
        </button>
      ))}
    </div>
  );
};

export default StarRating;
