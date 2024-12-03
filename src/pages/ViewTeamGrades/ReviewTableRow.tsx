import React from "react";
import { getColorClass } from "./utils"; // Utility function for heatmap coloring

// Props interface for ReviewTableRow component
interface ReviewTableRowProps {
  row: {
    questionText: string;
    reviews: number[];
    RowAvg: number;
  };
}

const ReviewTableRow: React.FC<ReviewTableRowProps> = ({ row }) => {
  return (
    <tr>
      <td>{row.questionText}</td>
      {row.reviews.map((score, index) => (
        <td key={index} className={getColorClass(score, 5)}> {/* Replace 5 with max score */}
          {score}
        </td>
      ))}
      <td>{row.RowAvg.toFixed(2)}</td>
    </tr>
  );
};

export default ReviewTableRow;
