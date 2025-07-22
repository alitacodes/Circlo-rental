import React, { useState } from "react";

type ReviewFormProps = {
  onSubmit: (review: { rating: number; comment: string }) => void;
};

const ReviewForm: React.FC<ReviewFormProps> = ({ onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating < 1 || rating > 5) {
      setError("Please select a rating.");
      return;
    }
    if (!comment.trim()) {
      setError("Please enter your feedback.");
      return;
    }
    setError("");
    onSubmit({ rating, comment });
    setRating(0);
    setComment("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 p-4 border rounded bg-white max-w-md">
      <div className="flex items-center gap-2">
        {[1, 2, 3, 4, 5].map(star => (
          <button
            key={star}
            type="button"
            className={star <= rating ? "text-yellow-400" : "text-gray-300"}
            onClick={() => setRating(star)}
            aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.385 2.46a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.385-2.46a1 1 0 00-1.175 0l-3.385 2.46c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.045 9.394c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.967z" />
            </svg>
          </button>
        ))}
      </div>
      <textarea
        className="w-full border rounded p-2"
        rows={3}
        placeholder="Write your feedback..."
        value={comment}
        onChange={e => setComment(e.target.value)}
      />
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-1 rounded w-full"
      >
        Submit Review
      </button>
    </form>
  );
};

export default ReviewForm; 