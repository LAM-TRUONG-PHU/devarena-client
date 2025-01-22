import React, { useEffect, useState } from "react";
import { usePrivate } from "@/hooks/usePrivateAxios";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useSearchParams } from "next/navigation";
import { setCompile, setSubList, setSubmissionId, setClickTracker, setLoading } from "@/redux/slices/admin/exerciseStudySlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { capitalize } from "@/utils/capitalize";
import { FaRegClock } from "react-icons/fa";

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    // Format the date to "Jan 11, 2025"
    const formattedDate = new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
    }).format(date);
    // Format the date with time to "Jan 11, 2025 20:04"
    const detailedDate = new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    }).format(date);
    return { formattedDate, detailedDate };
};


const formatStatus = (status: string): string => {
    return status
        .split(" ") // Split the string into words
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize the first letter of each word
        .join(" "); // Join the words back into a string
};
const TabSubmission = () => {
    const dispatch = useAppDispatch();
    const { subList, submissionId, clickTracker } = useAppSelector((state) => state.exercises);

    useEffect(() => {
        console.log(submissionId);
        console.log(`Click Tracker: ${clickTracker}`); // Logs the click count for debugging
    }, [submissionId, clickTracker]);
    return (
        <div className="w-full overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        {/* <TableHead>Status</TableHead> */}
                        <TableHead></TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Result</TableHead>
                        <TableHead>Runtime</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody className="cursor-pointer">
                    {subList.length > 0 ? (
                        [...subList].reverse().map((submission, index) => {
                            const { formattedDate, detailedDate } = formatDate(submission.createdAt);

                            return (
                                <TableRow key={index} onClick={() => {
                                    dispatch(setSubmissionId(submission._id!));
                                    dispatch(setCompile(formatStatus(submission.status) as "Accepted" | "Compile Error" | "Wrong Answer"));
                                    dispatch(setClickTracker(clickTracker + 1));
                                    dispatch(setLoading(true));
                                }}>
                                    <TableCell>{subList.length - index}</TableCell>

                                    <TableCell title={detailedDate}>
                                        <div
                                            className={`${submission.status === "accepted"
                                                ? "text-green_primary"
                                                : "text-red_primary"
                                                } text-base font-medium`}
                                        >
                                            {formatStatus(submission.status)}
                                        </div>{" "}
                                        <div className="text-xs">{formattedDate}</div>{" "}
                                    </TableCell>
                                    <TableCell>{submission.result}</TableCell>
                                    <TableCell>
                                        <div className="flex gap-1 items-center justify-start">
                                            <FaRegClock />
                                            {submission.status === "compile error"
                                                ? "N/A"
                                                : `${Number(submission.totalTime / 1000).toFixed(2)} s`}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            );
                        })
                    ) : (
                        <TableRow>
                            <TableCell colSpan={4} className="text-center">
                                No submissions found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
};

export default TabSubmission;
