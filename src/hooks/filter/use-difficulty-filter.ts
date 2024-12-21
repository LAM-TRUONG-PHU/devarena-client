import React, { use, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { EDifficulty } from "@/components/sort";
import useSearchQuery from "@/hooks/use-search-query";
import { set } from "react-hook-form";

const menuItems = [
    { label: "Easy", value: EDifficulty.Easy },
    {
        label: "Medium",
        value: EDifficulty.Medium,
    },
    {
        label: "Hard",
        value: EDifficulty.Hard,
    },
];

export default function useDifficultyFilter() {
    const { searchQuery, setSearchQuery } = useSearchQuery();

    const selected = useMemo(() => {
        return (searchQuery.get("difficulty")?.split(",") ?? []) as EDifficulty[];
    }, [searchQuery]);

    const applyDifficultyFilter = useCallback(
        (difficulty: EDifficulty[]) => {
            setSearchQuery("difficulty", difficulty);
        },
        [setSearchQuery]
    );
    return { applyDifficultyFilter, menuItems, searchQuery, selected };
}
