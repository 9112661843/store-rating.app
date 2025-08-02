import React from 'react';

const RatingStars = ({ rating, onRatingChange, readonly = false }) => {
  const handleStarClick = (starValue) => {
    if (!readonly && onRatingChange) {
      onRatingChange(starValue);
    }
  };

  return (
    <div className="rating-stars">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`star ${star <= rating ? 'filled' : ''}`}
          onClick={() => handleStarClick(star)}
          style={{ cursor: readonly ? 'default' : 'pointer' }}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default RatingStars; 