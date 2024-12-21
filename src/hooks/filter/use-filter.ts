import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import React, { useCallback } from "react";
import { useSelector } from "react-redux";
import { setFilter } from "@/redux/slices/filterSlice";
import useSearchQuery from "../use-search-query";
import { EDifficulty, EStatus, ESkills } from "@/components/sort";
import useArraySearchQuery from "../use-array-search-query";

export default function useMainFilter() {
    const { searchQuery, setSearchQuery } = useArraySearchQuery();
    const applyMainFilter = useCallback(
        (difficulty: EDifficulty[], status: EStatus[], skills: ESkills[]) => {
            setSearchQuery({
                difficulty,
                status,
                skills,
            });
        },
        [setSearchQuery]
    );
    return { applyMainFilter, searchQuery };
}
