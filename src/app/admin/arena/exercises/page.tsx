"use client";
import React, { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";
import { fetchContestExercises } from "@/redux/slices/admin/ContestSlice";
import { useAppDispatch } from "@/redux/hooks";
import { usePrivate } from "@/hooks/usePrivateAxios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import Link from "next/link";

const Page = () => {
  const searchParams = useSearchParams();
  const contestId = searchParams.get("contestId");
  const dispatch = useAppDispatch();
  const { exercises } = useAppSelector((state) => state.contest);
  const axios = usePrivate();

  useEffect(() => {
    dispatch(
      fetchContestExercises({
        contestId: contestId || "",
        axiosInstance: axios,
      })
    );
  }, [contestId]);

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Contest Exercises</h2>
        <Link href={`/admin/arena/exercises/form?contestId=${contestId}`}>Add Exercise</Link>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Score</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {exercises.map((exercise) => (
            <TableRow key={exercise._id}>
              <TableCell>{exercise._id}</TableCell>
              <TableCell>{exercise.title}</TableCell>
              <TableCell>{exercise.score}</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon" className="mr-2">
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Page;
