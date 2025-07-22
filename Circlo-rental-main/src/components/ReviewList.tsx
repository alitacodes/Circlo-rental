import React from "react";

type Review = {
  name: string;
  rating: number;
  comment: string;
  date: string;
};

type ReviewListProps = {
  reviews: Review[];
};

const ReviewList: React.FC<ReviewListProps> = ({ reviews }) => {
  if (reviews.length === 0) {
    return <div className="text-gray-500 text-sm">No reviews yet.</div>;
  }
  return (
    <div className="space-y-4">
      {reviews.map((review, idx) => (
        <div key={idx} className="border rounded p-4 bg-white">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-gray-800">{review.name}</span>
            <span className="flex items-center">
              {[1,2,3,4,5].map(star => (
                <svg
                  key={star}
                  className={`w-4 h-4 ${star <= review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.385 2.46a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.385-2.46a1 1 0 00-1.175 0l-3.385 2.46c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.045 9.394c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.967z" />
                </svg>
              ))}
            </span>
            <span className="text-xs text-gray-400 ml-2">{review.date}</span>
          </div>
          <div className="text-gray-700 text-sm">{review.comment}</div>
        </div>
      ))}
    </div>
  );
};

export default ReviewList; 