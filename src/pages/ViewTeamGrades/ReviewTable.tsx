import React, { useEffect, useState } from "react";
import Table from "../../components/Table/Table"; // Importing the Table component
import dummyDataRounds from "./Data/heatMapData.json"; // Importing dummy data for rounds
import dummyData from "./Data/dummyData.json"; // Importing dummy data
import RoundSelector from "./RoundSelector"; // Importing RoundSelector
import Statistics from "./Statistics"; // Importing Statistics component
import { calculateAverages } from "./utils"; // Importing utility functions
import { Link } from "react-router-dom"; // Importing Link for navigation
import { Collapse } from "react-bootstrap"; // Importing Collapse for toggling sections
import "./grades.scss"; // Importing styles

const ReviewTable: React.FC = () => {
  const [currentRound, setCurrentRound] = useState<number>(0); // State for the current round
  const [teamMembers, setTeamMembers] = useState<string[]>([]); // State for team members
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null); // State for the last updated timestamp
  const [open, setOpen] = useState(false); // State for collapsible content

  // Load team members on component mount
  useEffect(() => {
    setTeamMembers(dummyData.members);
    setLastUpdated(new Date()); // Set initial "Last Updated" timestamp
  }, []);

  // Handle round change
  const handleRoundChange = (roundIndex: number) => {
    setCurrentRound(roundIndex);
    setLastUpdated(new Date()); // Update timestamp when the round changes
  };

  // Data for the table
  const currentRoundData = dummyDataRounds[currentRound];
  const { averagePeerReviewScore } = calculateAverages(currentRoundData, "none");
  const tableData = currentRoundData.map((row: any, index: number) => ({
    id: index + 1,
    questionText: row.questionText,
    RowAvg: row.RowAvg,
  }));
  const columns = [
    { accessorKey: "id", header: "ID" },
    { accessorKey: "questionText", header: "Question" },
    { accessorKey: "RowAvg", header: "Average Score" },
  ];

  console.log("Current Round Data:", currentRoundData);
  console.log("Table Columns:", columns);
  console.log("Table Data:", tableData);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-2">Summary Report: Program 2</h2>
      <h5 className="text-xl font-semibold mb-1">Team: {dummyData.team}</h5>
      <h5 className="text-2xl font-bold mb-2">
        Team members:{" "}
        {teamMembers.map((member, index) => (
          <span key={index}>
            {member}
            {index !== teamMembers.length - 1 && ", "}
          </span>
        ))}
      </h5>
      <h5 className="mb-4">
        Average peer review score: <span>{averagePeerReviewScore}</span>
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

      {/* Table for review data */}
      <Table
        data={tableData}
        columns={columns}
        showGlobalFilter={true}
        showPagination={true}
      />

      {/* Display Last Updated Timestamp */}
      <div style={{ marginTop: "20px" }}>
        <div>
          Last Updated:{" "}
          {lastUpdated ? lastUpdated.toLocaleString() : "Never"}
        </div>
        <button
          onClick={() => setLastUpdated(new Date())}
          style={{ marginLeft: "10px", cursor: "pointer", color: "blue" }}
        >
          Refresh Now
        </button>
      </div>

      {/* Round Selector */}
      <RoundSelector
        currentRound={currentRound}
        handleRoundChange={handleRoundChange}
      />

      {/* Statistics Component */}
      <Statistics average={averagePeerReviewScore} />

      {/* Grade and comment section */}
      <p className="mt-4">
        <h3>Grade and comment for submission</h3>
        Grade: {dummyData.grade}
        <br />
        Comment: {dummyData.comment}
        <br />
        Late Penalty: {dummyData.late_penalty}
        <br />
      </p>

      <Link to="/">Back</Link>
    </div>
  );
};

export default ReviewTable;
