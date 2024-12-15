"use client";

import React, { use, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { EStatus } from "@/components/sort";
import useSearchQuery from "@/hooks/use-search-query";
import { set } from "react-hook-form";

const menuItems = [
    { label: "In Progress", value: EStatus.InProgress },
    {
        label: "Solved",
        value: EStatus.Solved,
    },
    {
        label: "Unsolved",
        value: EStatus.Unsolved,
    },
];

// export default function useStatusFilter() {
//     const { searchQuery, setSearchQuery } = useSearchQuery();

//     const selected = useMemo(() => {
//         return searchQuery.getAll("status") as EStatus[];
//     }, [searchQuery]);

//     const applyStatusFilter = useCallback(
//         (status: EStatus[]) => {
//             setSearchQuery("status", status);
//         },
//         [setSearchQuery]
//     );
//     return { applyStatusFilter, menuItems, searchQuery, selected };
// }

//use comma
export default function useStatusFilter() {
    const { searchQuery, setSearchQuery } = useSearchQuery();

    const selected = useMemo(() => {
        return (searchQuery.get("status")?.split(",") ?? []) as EStatus[];
    }, [searchQuery]);

    const applyStatusFilter = useCallback(
        (status: EStatus[]) => {
            setSearchQuery("status", status);
        },
        [setSearchQuery]
    );
    return { applyStatusFilter, menuItems, searchQuery, selected };
}
