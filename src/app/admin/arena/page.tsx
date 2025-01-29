"use client";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { createContest } from "@/redux/slices/contestClientSlice";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, PlayCircle } from "lucide-react";
import useAxios from "@/hooks/useAxios";
import { fetchContests } from "@/redux/slices/admin/ContestSlice";
import { usePrivate } from "@/hooks/usePrivateAxios";
import AddContestModal from "@/components/admin/contest/AddContestModal";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

export default function AdminContestPage() {
  const dispatch = useAppDispatch();
  const { contests, error, loading } = useAppSelector((state) => state.contest);
  const axios = usePrivate();
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  useEffect(() => {
    dispatch(fetchContests({ axiosInstance: axios }));
  }, [dispatch]);

  useEffect(() => {
    if (error)
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
  }, [error]);
  // if(loading) return <div>Loading...</div>;
  // if(error) return <div>Error: {error}</div>;
  // Fake data for 5 contests

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-gray-500 hover:bg-gray-600";
      case "published":
        return "bg-green-500 hover:bg-green-600";
      case "completed":
        return "bg-blue-500 hover:bg-blue-600";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="p-8">
      <AddContestModal isOpen={isOpen} setIsOpen={setIsOpen} />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Contests</h1>
        <Button onClick={() => setIsOpen(true)}>Add New Contest</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">No.</TableHead>
            <TableHead>Contest Name</TableHead>
            <TableHead>Contest Details</TableHead>

            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contests.map((contest, index) => (
            <TableRow key={contest._id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{contest.contestName}</TableCell>
              <TableCell>
                {/* <Link href={`/admin/arena/exercises?contestId=${contest._id}`}>
                  <Button
                    variant="default"
                    size="icon"
                    className="mr-2 text-green-500"
                  >
                    Details
                  </Button>
                </Link> */}
                <Link href={`/admin/arena/exercises?contestId=${contest._id}`}>
                  Details
                </Link>
              </TableCell>
              <TableCell>
                <Badge className={getStatusBadgeColor(contest.status)}>
                  {contest.status}
                </Badge>
              </TableCell>

              <TableCell className="text-right">
                {contest.status === "draft" && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="mr-2 text-green-500"
                  >
                    <PlayCircle className="h-4 w-4" />
                  </Button>
                )}
                <Button variant="ghost" size="icon" className="mr-2">
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="text-red-500">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
