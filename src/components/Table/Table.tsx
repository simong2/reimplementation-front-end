import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import React, { useEffect, useMemo, useState } from "react";
import { Col, Container, Row, Table as BTable } from "react-bootstrap";
import ColumnFilter from "./ColumnFilter";
import GlobalFilter from "./GlobalFilter";
import Pagination from "./Pagination";
import RowSelectCheckBox from "./RowSelectCheckBox";
import { FaSearch } from "react-icons/fa";
import * as XLSX from "xlsx";

interface TableProps {
  data: Record<string, any>[];
  columns: ColumnDef<any, any>[];
  showGlobalFilter?: boolean;
  showColumnFilter?: boolean;
  showPagination?: boolean;
  tableSize?: { span: number; offset: number };
  columnVisibility?: Record<string, boolean>;
  onSelectionChange?: (selectedData: Record<any, any>[]) => void;
}

const Table: React.FC<TableProps> = ({
  data: initialData,
  columns,
  showGlobalFilter = false,
  showColumnFilter = true,
  showPagination = true,
  onSelectionChange,
  columnVisibility = {},
  tableSize = { span: 12, offset: 0 },
}) => {
  const colsPlusSelectable = useMemo(() => {
    const selectableColumn: any = {
      id: "select",
      header: ({ table }: any) => (
        <RowSelectCheckBox
          {...{
            checked: table.getIsAllRowsSelected(),
            indeterminate: table.getIsSomeRowsSelected(),
            onChange: table.getToggleAllRowsSelectedHandler(),
          }}
        />
      ),
      cell: ({ row }: any) => (
        <RowSelectCheckBox
          {...{
            checked: row.getIsSelected(),
            disabled: !row.getCanSelect(),
            indeterminate: row.getIsSomeSelected(),
            onChange: row.getToggleSelectedHandler(),
          }}
        />
      ),
      enableSorting: false,
      enableFilter: false,
    };
    return [selectableColumn, ...columns];
  }, [columns]);

  const [rowSelection, setRowSelection] = useState({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState<string | number>("");
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibilityState, setColumnVisibilityState] = useState(columnVisibility);
  const [isGlobalFilterVisible, setIsGlobalFilterVisible] = useState(showGlobalFilter);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const table = useReactTable({
    data: initialData,
    columns: colsPlusSelectable,
    state: {
      sorting,
      globalFilter,
      columnFilters,
      rowSelection,
      columnVisibility: columnVisibilityState,
    },
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibilityState,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const exportTableData = (format: "csv" | "xlsx") => {
    const tableData = initialData.map((row) => {
      const rowData: Record<string, any> = {};
      columns.forEach((col) => {
        const accessor = col.id; // Use column id for keys
        if (accessor) {
          rowData[accessor] = row[accessor];
        }
      });
      return rowData;
    });

    const worksheet = XLSX.utils.json_to_sheet(tableData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "TableData");

    const fileType = format === "csv" ? "csv" : "xlsx";
    XLSX.writeFile(workbook, `table_data.${fileType}`);
  };

  useEffect(() => {
    setLastUpdated(new Date());
  }, [initialData]);

  return (
    <>
      <Container>
        <Row className="mb-md-2">
          <Col md={{ span: 12 }}>
            {isGlobalFilterVisible && (
              <GlobalFilter filterValue={globalFilter} setFilterValue={setGlobalFilter} />
            )}
          </Col>
          <span style={{ marginLeft: "5px" }} onClick={() => setIsGlobalFilterVisible((prev) => !prev)}>
            <FaSearch style={{ cursor: "pointer" }} />
            {isGlobalFilterVisible ? " Hide" : " Show"}
          </span>
        </Row>
      </Container>
      <Container>
        <Row>
          <Col md={tableSize}>
            <BTable striped hover responsive size="sm">
              <thead className="table-secondary">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th key={header.id} colSpan={header.colSpan}>
                        {header.isPlaceholder ? null : (
                          <div
                            {...{
                              className: header.column.getCanSort()
                                ? "cursor-pointer select-none"
                                : "",
                              onClick: header.column.getToggleSortingHandler(),
                            }}
                          >
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {header.column.getIsSorted()
                              ? header.column.getIsSorted() === "asc"
                                ? " 🔼"
                                : " 🔽"
                              : null}
                          </div>
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </BTable>
            {showPagination && (
              <Pagination
                nextPage={table.nextPage}
                previousPage={table.previousPage}
                canNextPage={() => table.getCanNextPage()} // Corrected to match expected type
                canPreviousPage={() => table.getCanPreviousPage()} // Corrected to match expected type
                setPageIndex={table.setPageIndex}
                setPageSize={table.setPageSize}
                getPageCount={table.getPageCount}
                getState={table.getState}
              />
            )}
            <div style={{ marginTop: "10px" }}>
              <div>
                Export Options:
                <span
                  onClick={() => exportTableData("csv")}
                  style={{ cursor: "pointer", marginLeft: "10px", color: "blue" }}
                >
                  CSV
                </span>
                |
                <span
                  onClick={() => exportTableData("xlsx")}
                  style={{ cursor: "pointer", marginLeft: "10px", color: "blue" }}
                >
                  Excel
                </span>
              </div>
              <div style={{ marginTop: "10px" }}>
                Last Updated: {lastUpdated ? lastUpdated.toLocaleString() : "Never"}
                <span
                  style={{ cursor: "pointer", marginLeft: "10px", color: "blue" }}
                  onClick={() => setLastUpdated(new Date())}
                >
                  Refresh Now
                </span>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Table;
