import type { ChangeEvent, ReactNode } from "react";
import {
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";

export interface Column<T> {
  header: string;
  render: (row: T) => ReactNode;
  align?: "left" | "right" | "center";
  width?: number | string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string | number;
  loading: boolean;
  total: number;
  page: number;
  rowsPerPage: number;
  onPage: (event: unknown, page: number) => void;
  onRowsPerPage: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  emptyText?: string;
}

/** One table for every list screen: columns are described, the table does the rest. */
export default function DataTable<T>({
  columns,
  rows,
  rowKey,
  loading,
  total,
  page,
  rowsPerPage,
  onPage,
  onRowsPerPage,
  emptyText = "No records found.",
}: DataTableProps<T>) {
  return (
    <>
      {loading && <LinearProgress />}

      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ "& th": { fontWeight: "bold" } }}>
              {columns.map((column) => (
                <TableCell
                  key={column.header}
                  align={column.align}
                  sx={{ width: column.width }}
                >
                  {column.header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {rows.map((row) => (
              <TableRow key={rowKey(row)} hover>
                {columns.map((column) => (
                  <TableCell key={column.header} align={column.align}>
                    {column.render(row)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {!loading && rows.length === 0 && (
        <Typography align="center" color="text.secondary" sx={{ py: 3 }}>
          {emptyText}
        </Typography>
      )}

      <TablePagination
        component="div"
        count={total}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={onPage}
        onRowsPerPageChange={onRowsPerPage}
        rowsPerPageOptions={[5, 10, 25, 50]}
      />
    </>
  );
}
