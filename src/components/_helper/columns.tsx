"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Student } from "@/types/student";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Award, LucideArrowUpDown } from "lucide-react";

// Currency formatter
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Total calculator
const calculateTotal = (student: Student) => {
  return (
    (student.examFees || 0) +
    (student.foodFees || 0) +
    (student.rice || 0) +
    (student.gargentFees || 0)
  );
};

// Badge color helper
const getBeltBadgeColor = (beltName: string) => {
  switch (beltName) {
    case "White":
      return "bg-gray-100 text-gray-800 border-gray-300";
    case "Blue":
      return "bg-blue-100 text-blue-800 border-blue-300";
    case "Yellow":
      return "bg-yellow-100 text-yellow-800 border-yellow-300";
    case "Green":
      return "bg-green-100 text-green-800 border-green-300";
    case "Brown":
      return "bg-amber-100 text-amber-800 border-amber-300";
    default:
      return "bg-gray-100 text-gray-800 border-gray-300";
  }
};

export const columns: ColumnDef<Student>[] = [
  {
    accessorKey: "slNo",
    sortingFn: (rowA, rowB, columnId) => {
      return Number(rowA.getValue(columnId)) - Number(rowB.getValue(columnId));
    },
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="px-1"
      >
        SL
        <LucideArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="font-bold text-primary w-[20px]">
        #{row.original.slNo}
      </div>
    ),
  },
  {
    accessorKey: "studentName",
    header: () => <div style={{ width: "150px" }}>Student Name</div>,
    cell: ({ row }) => (
      <div className="font-semibold w-[150px]">
        {row.original.studentName}
      </div>
    ),
  },
  {
    accessorKey: "beltLevel",
    header: () => <div style={{ width: "150px" }}>Belt Level</div>,
    cell: ({ row }) => (
      <div className="w-[150px]">
        <Badge
          variant="outline"
          className={`${getBeltBadgeColor(
            row.original.beltLevel.name
          )} font-medium`}
        >
          <Award className="w-3 h-3 mr-1" />
          {row.original.beltLevel.name} {row.original.beltLevel.kyu}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "examFees",
    header: () => <div className="text-right w-[100px]">Exam Fees</div>,
    cell: ({ row }) => (
      <div className="text-right font-medium w-[100px]">
        {formatCurrency(row.original.examFees)}
      </div>
    ),
  },
  {
    accessorKey: "foodFees",
    header: () => <div className="text-right w-[100px]">Food Fees</div>,
    cell: ({ row }) => (
      <div className="text-right font-medium w-[100px]">
        {row.original.foodFees
          ? formatCurrency(row.original.foodFees)
          : "—"}
      </div>
    ),
  },
  {
    accessorKey: "rice",
    header: () => <div className="text-right w-[100px]">Rice</div>,
    cell: ({ row }) => (
      <div className="text-right font-medium w-[100px]">
        {row.original.rice ? formatCurrency(row.original.rice) : "—"}
      </div>
    ),
  },
  {
    accessorKey: "gargentFees",
    header: () => <div className="text-right w-[100px]">Garment Fees</div>,
    cell: ({ row }) => (
      <div className="text-right font-medium w-[100px]">
        {row.original.gargentFees
          ? formatCurrency(row.original.gargentFees)
          : "—"}
      </div>
    ),
  },
  {
    id: "total",
    header: () => <div className="text-right w-[100px]">Total</div>,
    cell: ({ row }) => (
      <div className="text-right font-bold text-primary text-lg w-[100px]">
        {formatCurrency(calculateTotal(row.original))}
      </div>
    ),
  },
];
