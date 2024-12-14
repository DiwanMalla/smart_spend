"use client";

import { getTransactionHistoryResponseType } from "@/app/api/transaction-history/route";
import { DateToUTCDate } from "@/lib/helpers";
import { useQuery } from "@tanstack/react-query";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import SkeletonWrapper from "@/components/SkeletonWrapper";
interface Props {
  from: Date;
  to: Date;
}

type TransactionHistoryRow = getTransactionHistoryResponseType[0];

export const columns: ColumnDef<TransactionHistoryRow>[] = [
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => (
      <div className="flex items-center space-x-2">
        <span>{row.original.categoryIcon}</span>
        <span className="capitalize">{row.original.category}</span>
      </div>
    ),
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => (
      <div>
        {row.original.amount.toLocaleString("en-US", {
          style: "currency",
          currency: "USD", // Replace with dynamic currency if needed
        })}
      </div>
    ),
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => (
      <div>
        {new Date(row.original.date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })}
      </div>
    ),
  },
];

const TransactionTable = ({ from, to }: Props) => {
  const history = useQuery({
    queryKey: ["transaction-history", from, to],
    queryFn: () =>
      fetch(
        `/api/transaction-history?from=${DateToUTCDate(
          from
        )}&to=${DateToUTCDate(to)}`
      ).then((res) => res.json()),
  });

  const data = history.data || [];
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  // Handle loading and error states
  if (history.isLoading) {
    return <div>Loading...</div>;
  }

  if (history.isError) {
    return <div>Error loading data</div>;
  }

  return (
    <div className="w-full">
      <div className="flex flex-wrap items-end justify-between gap-2 py-4">
        TOD0:Filters
      </div>

      <SkeletonWrapper isLoading={history.isFetching}>
        <div className="overflow-x-auto">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </SkeletonWrapper>
    </div>
  );
};

export default TransactionTable;
