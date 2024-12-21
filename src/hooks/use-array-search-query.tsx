"use client";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import React from "react";

export default function useArraySearchQuery() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const createQueryString = React.useCallback(
        (updates: Record<string, string[]>) => {
            const params = new URLSearchParams(searchParams.toString());

            Object.entries(updates).forEach(([key, values]) => {
                if (values.length === 0) {
                    params.delete(key);
                } else {
                    params.set(key, values.join(","));
                }
            });

            return params.toString();
        },
        [searchParams]
    );

    const setSearchQuery = React.useCallback(
        (updates: Record<string, string[]>) => {
            const queryString = createQueryString(updates);
            router.push(`${pathname}?${queryString}`);
        },
        [createQueryString, pathname, router]
    );

    return { searchQuery: searchParams, setSearchQuery };
}
