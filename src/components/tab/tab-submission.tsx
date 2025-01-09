import React, { useEffect, useState } from "react";
import { usePrivate } from "@/hooks/usePrivateAxios";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface ISubmission {
  status: string;
  score: number;
  result: string;
  createdAt: string; // Update to string as returned by the API
}

const TabSubmission = () => {
  const axios = usePrivate();
  const [subList, setSubList] = useState<ISubmission[]>([]);

  useEffect(() => {
    axios
      .get(`/exercise-status/submission/677bc2473f311b3afd07ddb9`)
      .then((res) => {
        setSubList(res.data.data.submission);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  // Helper function to format the date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
  
    // Extract day, month, year, hours, minutes, and seconds
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
  
    // Construct the formatted string
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  };
  

  return (
    <div className="w-full overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            {/* <TableHead>Status</TableHead> */}
            <TableHead>Score</TableHead>
            <TableHead>Result</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Details</TableHead>

          </TableRow>
        </TableHeader>
        <TableBody>
          {subList.length > 0 ? (
            subList.map((submission, index) => (
              <TableRow key={index} className={`${submission.status==="successfully"?'text-green-400':'text-red-400'}`}>
                {/* <TableCell>{submission.status}</TableCell> */}
                <TableCell>{submission.score}</TableCell>
                <TableCell>{submission.result}</TableCell>
                <TableCell>{formatDate(submission.createdAt)}</TableCell>
                <TableCell>View details</TableCell>

              </TableRow>
            ))
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
