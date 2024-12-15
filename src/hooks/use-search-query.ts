"use client";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import React from "react";
// use object
// export default function useSearchQuery() {
//     const router = useRouter();
//     const pathname = usePathname();
//     const searchParams = useSearchParams();

//     const createQueryString = React.useCallback(
//         (name: string, value: string[]) => {
//             const params = new URLSearchParams(searchParams.toString());
//             params.delete(name);

//             value.forEach((element) => {
//                 params.append(name, element);
//             });

//             return params.toString();
//         },
//         [searchParams]
//     );
//     const setSearchQuery = React.useCallback(
//         (name: string, value: string[]) => {
//             const queryString = createQueryString(name, value);
//             router.push(`${pathname}?${queryString}`);
//         },
//         [createQueryString, pathname, router]
//     );

//     return { searchQuery: searchParams, setSearchQuery };
// }

// use comma
export default function useSearchQuery() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const createQueryString = React.useCallback(
        (name: string, value: string[]) => {
            const params = new URLSearchParams(searchParams.toString());
            if (value.length == 0) {
                params.delete(name);
            } else {
                params.set(name, value.join(","));
            }
            return params.toString();
        },
        [searchParams]
    );
    const setSearchQuery = React.useCallback(
        (name: string, value: string[]) => {
            const queryString = createQueryString(name, value);
            router.push(`${pathname}?${queryString}`);
        },
        [createQueryString, pathname, router]
    );

    return { searchQuery: searchParams, setSearchQuery };
}
