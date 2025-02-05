"use client";

import * as React from "react";
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { IExercise } from "@/types/Exercise";
import { LoadingSpinner } from "@/components/loading";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { setCurrentStep } from "@/redux/slices/admin/StudyFormSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useEffect, useMemo, useState } from "react";
import { set } from "store";

import { deleteExercise, setCurrentExercise, setExercise } from "@/redux/slices/admin/exerciseStudySlice";
import { usePrivate } from "@/hooks/usePrivateAxios";
import { toast, useToast } from "@/hooks/use-toast";
import { IoIosArrowRoundBack } from "react-icons/io";
import { createSlug } from "@/lib/helper";
import { CategoryType } from "@/types/CategoryType";

type TableExerciseProps = {
    exercises: IExercise[];
    loading: boolean;
    categoryType?: CategoryType;
};

export function TableExercise(props: TableExerciseProps) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({
        _id: false,
    });
    const [rowSelection, setRowSelection] = React.useState({});
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const courseId = searchParams.get("id");
    const dispatch = useAppDispatch();
    const [_id, setId] = useState<string | null>(null);
    const axiosPrivate = usePrivate();
    const { toast } = useToast();

    const columns: ColumnDef<IExercise>[] = [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "_id",
            header: "ID",
            cell: ({ row }) => <div className="capitalize">{row.getValue("_id")}</div>,
        },
        {
            accessorKey: "title",
            header: ({ column }) => {
                return (
                    <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                        Title
                        <ArrowUpDown />
                    </Button>
                );
            },
            cell: ({ row }) => <div className="capitalize">{row.getValue("title")}</div>,
        },
        {
            accessorKey: "difficulty",
            header: "Difficulty",
            cell: ({ row }) => <div className="capitalize">{row.getValue("difficulty")}</div>,
        },
        {
            accessorKey: "tags",
            header: "Tags",
            cell: ({ row }) => (
                <div className="capitalize flex gap-2">
                    {(row.getValue("tags") as string[]).length > 2 ? (
                        <>
                            {(row.getValue("tags") as string[])
                                .slice(0, 2) // Show only the first two tags
                                .map((tag: string) => (
                                    <span key={tag} className="tag bg-gray-200">
                                        {tag}
                                    </span>
                                ))}
                            <span className="tag bg-gray-200">
                                +{(row.getValue("tags") as string[]).length - 2} more
                            </span>
                        </>
                    ) : (
                        (row.getValue("tags") as string[]).map((tag: string) => (
                            <span key={tag} className="tag bg-gray-200">
                                {tag}
                            </span>
                        ))
                    )}
                </div>
            ),
        },

        {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => {
                const exercise = row.original;

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => {
                                router.push(`${pathname}/${createSlug(exercise.title)}?id=${exercise._id}`);
                            }}>Edit</DropdownMenuItem>
                            <DropdownMenuItem onClick={async () => {
                                await axiosPrivate.delete(`/study/${exercise._id}`).then(() => {
                                    dispatch(deleteExercise(exercise._id));
                                    toast({
                                        title: "Success",
                                        description: "Exercise deleted successfully",
                                        variant: "success",
                                    });
                                })

                            }}>Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];

    const table = useReactTable({
        data: props.exercises,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    });

    return (
        <div className="w-full relative">

            <div className="flex items-center py-4 justify-between">
                <Input
                    placeholder="Filter title..."
                    value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
                    onChange={(event) => table.getColumn("title")?.setFilterValue(event.target.value)}
                    className="max-w-sm"
                />
                <div className="flex gap-4">
                    <Button
                        variant="default"
                        size="default"
                        onClick={() => {

                            router.push(`${pathname}/exercise${props.categoryType === CategoryType.Algorithm ? "" : `?id=${courseId}`}`);
                            dispatch(setExercise({} as IExercise));
                            dispatch(setCurrentStep(0));
                        }}
                    >
                        Create Exercise
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="ml-auto">
                                Columns <ChevronDown />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {table
                                .getAllColumns()
                                .filter((column) => column.getCanHide())
                                .map((column) => {
                                    return (
                                        <DropdownMenuCheckboxItem
                                            key={column.id}
                                            className="capitalize"
                                            checked={column.getIsVisible()}
                                            onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                        >
                                            {column.id}
                                        </DropdownMenuCheckboxItem>
                                    );
                                })}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
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
                        {props.loading ? (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    align="center"

                                >
                                    <LoadingSpinner />
                                </TableCell>
                            </TableRow>
                        ) : table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    align="center"
                                >
                                    No data available
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>


                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                    {table.getFilteredSelectedRowModel().rows.length} of{" "}
                    {table.getFilteredRowModel().rows.length} row(s) selected.
                </div>
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
}
