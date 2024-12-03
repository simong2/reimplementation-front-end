import React, { useEffect, useState } from "react";
import ReviewTableRow from "./ReviewTableRow"; // For heatmap logic
import RoundSelector from "./RoundSelector"; // For round selection
import dummyDataRounds from "./Data/heatMapData.json"; // Dummy data for rounds
import dummyData from "./Data/dummyData.json"; // Dummy data
import { calculateAverages } from "./utils"; // Utility functions
import { Collapse, Button } from "react-bootstrap"; // For collapsible content and export
import * as XLSX from "xlsx"; // For exporting data
import { Link } from "react-router-dom";
import "./grades.scss";

const ReviewTable: React.FC = () => {
  const [currentRound, setCurrentRound] = useState<number>(0); // Current round state
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null); // Timestamp state
  const [open, setOpen] = useState(false); // Collapsible state

  // Set initial timestamp on component mount
  useEffect(() => {
    setLastUpdated(new Date());
  }, []);

  // Export data to Excel
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(dummyDataRounds[currentRound]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Heatmap Data");
    XLSX.writeFile(wb, `heatmap_data_${new Date().toISOString()}.xlsx`);
  };

  const averages = calculateAverages(dummyDataRounds[currentRound], "none");

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-2">Summary Report: Program 2</h2>
      <h5 className="text-xl font-semibold mb-1">Team: {dummyData.team}</h5>
      <h5 className="text-2xl font-bold mb-2">
        Team members:{" "}
        {dummyData.members.map((member, index) => (
          <span key={index}>
            {member}
            {index !== dummyData.members.length - 1 && ", "}
          </span>
        ))}
      </h5>
      <h5 className="mb-4">
        Average peer review score: <span>{averages.averagePeerReviewScore}</span>
      </h5>
      <div>Tagging: 97/97</div>

      {/* Collapsible section for submission links */}
      <div>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setOpen(!open);
          }}
        >
          {open ? "Hide Submission" : "Show Submission"}
        </a>
        <Collapse in={open}>
          <div id="example-collapse-text">
            <br />
            {open && (
              <>
                <a
                  href="https://github.ncsu.edu/Program-2-Ruby-on-Rails/WolfEvents"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub Repo
                </a>
                <br />
                <a
                  href="http://152.7.177.44:8080/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Hosted App
                </a>
                <br />
                <a
                  href="https://github.ncsu.edu/Program-2-Ruby-on-Rails/WolfEvents/raw/main/README.md"
                  download="README.md"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Download README
                </a>
              </>
            )}
          </div>
        </Collapse>
      </div>

      {/* Export Button */}
      <Button onClick={exportToExcel} variant="success">
        Export to Excel
      </Button>

      {/* Heatmap Table */}
      <table className="heatmap">
        <thead>
          <tr>
            <th>Question No.</th>
            {dummyDataRounds[currentRound][0].reviews.map((_: any, index: number) => (
              <th key={index}>Review {index + 1}</th>
            ))}
            <th>Average</th>
          </tr>
        </thead>
        <tbody>
          {dummyDataRounds[currentRound].map((row: any, index: number) => (
            <ReviewTableRow key={index} row={row} />
          ))}
        </tbody>
      </table>

      {/* Display Last Updated Timestamp */}
      <div style={{ marginTop: "20px" }}>
        <div>
          Last Updated: {lastUpdated ? lastUpdated.toLocaleString() : "Never"}
        </div>
        <button
          onClick={() => setLastUpdated(new Date())}
          style={{ marginLeft: "10px", cursor: "pointer", color: "blue" }}
        >
          Refresh Now
        </button>
      </div>

      <RoundSelector
  currentRound={currentRound}
  handleRoundChange={(roundIndex: number) => setCurrentRound(roundIndex)}
/>


      <Link to="/">Back</Link>
    </div>
  );
};

export default ReviewTable;
