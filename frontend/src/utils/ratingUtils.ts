/**
 * Rating utility functions to safely handle rating values
 */

export const safeRating = (rating: any): number => {
  const num = parseFloat(rating);
  return isNaN(num) ? 0 : Math.max(0, Math.min(5, num));
};

export const formatRating = (rating: any): string => {
  const safeRatingValue = safeRating(rating);
  return safeRatingValue > 0 ? `${safeRatingValue.toFixed(1)}` : 'No ratings yet';
};

export const formatRatingWithText = (rating: any): string => {
  const safeRatingValue = safeRating(rating);
  return safeRatingValue > 0 ? `${safeRatingValue.toFixed(1)} rating` : 'No ratings yet';
};

export const formatReviewText = (rating: any): string => {
  const safeRatingValue = safeRating(rating);
  return safeRatingValue > 0 ? `${safeRatingValue.toFixed(1)} out of 5` : 'No reviews yet';
};

export const getStarClassName = (rating: any, position: number, className: string = "text-sm"): string => {
  const safeRatingValue = safeRating(rating);
  const filled = position < Math.floor(safeRatingValue);
  const half = !filled && position < safeRatingValue;

  return `fa-solid fa-star${
    filled ? '' : half ? '-half-stroke' : '-regular'
  } text-yellow-400 ${className}`;
};

// Simple star rendering helper that returns an array of JSX elements
// This should be used within React components
export const createStarElements = (rating: any, className: string = "text-sm") => {
  const safeRatingValue = safeRating(rating);

  return Array.from({ length: 5 }, (_, i) => {
    const filled = i < Math.floor(safeRatingValue);
    const half = !filled && i < safeRatingValue;
    const starClassName = `fa-solid fa-star${
      filled ? '' : half ? '-half-stroke' : '-regular'
    } text-yellow-400 ${className}`;

    return {
      key: i,
      className: starClassName
    };
  });
};