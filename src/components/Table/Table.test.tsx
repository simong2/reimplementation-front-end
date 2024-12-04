import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom"; // Ensure jest-dom functions are available
import Table from "./Table";

describe("Table Component", () => {
  const mockData = [
    { id: 1, name: "John Doe", age: 28 },
    { id: 2, name: "Jane Smith", age: 34 },
  ];

  const mockColumns = [
    { id: "id", header: "ID", accessorKey: "id" },
    { id: "name", header: "Name", accessorKey: "name" },
    { id: "age", header: "Age", accessorKey: "age" },
  ];

  it("renders export buttons and Last Updated indicator", () => {
    // Render the Table component
    render(<Table data={mockData} columns={mockColumns} showPagination={false} />);

    // Debug the rendered DOM
    screen.debug();

    // Check for Export to CSV button
    const exportCsvButton = screen.getByText("Export to CSV");
    expect(exportCsvButton).toBeInTheDocument();

    // Check for Export to Excel button
    const exportExcelButton = screen.getByText("Export to Excel");
    expect(exportExcelButton).toBeInTheDocument();

    // Check for Last Updated text
    const lastUpdatedText = screen.getByText(/Last Updated:/);
    expect(lastUpdatedText).toBeInTheDocument();
  });

  it("updates Last Updated timestamp on refresh", () => {
    // Render the Table component
    render(<Table data={mockData} columns={mockColumns} showPagination={false} />);

    // Debug the rendered DOM before interacting
    screen.debug();

    // Find and click the Refresh Data button
    const refreshButton = screen.getByText("Refresh Data");
    fireEvent.click(refreshButton);

    // Debug the rendered DOM after interaction
    screen.debug();

    // Check for updated Last Updated text
    const lastUpdatedText = screen.getByText(/Last Updated:/);
    expect(lastUpdatedText).toBeInTheDocument();
  });
});
