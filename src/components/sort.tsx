import {
    Cloud,
    CreditCard,
    Github,
    Keyboard,
    LifeBuoy,
    LogOut,
    Mail,
    MessageSquare,
    Plus,
    PlusCircle,
    Settings,
    User,
    UserPlus,
    Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
    DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Filter, ChevronDown } from "lucide-react";
import { SortOptionTitle } from "@/app/(client)/study/[language]/page";
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu";
import { use, useEffect, useRef, useState } from "react";
import { set } from "react-hook-form";

type SortProps<T = any> = {
    title: SortOptionTitle;
    isFilter?: boolean;
    applyFilter?: (value: T[]) => void;
    menuItems: { label: string; value: T }[];
    selected: T[];
};

export enum EDifficulty {
    Easy = "easy",
    Medium = "medium",
    Hard = "hard",
}

export enum EStatus {
    InProgress = "in-progress",
    Solved = "solved",
    Unsolved = "unsolved",
}

export enum ESkills {
    Array = "array",
    String = "string",
    "Hash Table" = "hash-table",
    "Dynamic Programming" = "dynamic-programming",
    Math = "math",
    Sorting = "sorting",
    Greedy = "greedy",
    "Depth-First Search" = "depth-first-search",
    Database = "database",
    "Binary Search" = "binary-search",
    Matrix = "matrix",
    Tree = "tree",
    "Breadth-First Search" = "breadth-first-search",
    "Bit Manipulation" = "bit-manipulation",
    "Two Pointers" = "two-pointers",
    "Prefix Sum" = "prefix-sum",
    "Heap (Priority Queue)" = "heap-(priority-queue)",
    "Binary Tree" = "binary-tree",
    Simulation = "simulation",
    Stack = "stack",
    Graph = "graph",
    Counting = "counting",
    "Sliding Window" = "sliding-window",
    Design = "design",
    Backtracking = "backtracking",
    Enumeration = "enumeration",
    "Union Find" = "union-find",
    "Linked List" = "linked-list",
    "Number Theory" = "number -theory",
    "Ordered Set" = "ordered-set",
    "Monotonic Stack" = "monotonic-stack",
    Trie = "trie",
    "Segment Tree" = "segment-tree",
    Bitmask = "bitmask",
    Queue = "queue",
    "Divide and Conquer" = "divide-and-conquer",
    Recursion = "recursion",
    Combinatorics = "combinatorics",
    "Binary Indexed Tree" = "binary-indexed-tree",
    Geometry = "geometry",
    "Binary Search Tree" = "binary-search-tree",
    "Hash Function" = "hash-function",
    Memoization = "memoization",
    "String Matching" = "string-matching",
    "Topological Sort" = "topological-sort",
    "Shortest Path" = "shortest-path",
    "Rolling Hash" = "rolling-hash",
    "Game Theory" = "game-theory",
    Interactive = "interactive",
    "Data Stream" = "data-stream",
    "Monotonic Queue" = "monotonic-queue",
    Brainteaser = "brainteaser",
    Randomized = "randomized",
    "Merge Sort" = "merge-sort",
    "Doubly-Linked List" = "doubly-linked-list",
    "Counting Sort" = "counting-sort",
    Iterator = "iterator",
    Concurrency = "concurrency",
    "Probability and Statistics" = "probability-and-statistics",
    Quickselect = "quickselect",
    "Suffix Array" = "suffix-array",
    "Bucket Sort" = "bucket-sort",
}

export function Sort<T>(props: SortProps<T>) {
    // const [checked, setChecked] = useState<Checked>(false);
    const [value, setValue] = useState<T[]>(props.selected);
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    function cancelChange() {
        setValue(props.selected);
        setOpen(false);
    }

    useEffect(() => {
        setValue(props.selected);
    }, [props.selected]);

    return (
        <DropdownMenu
            open={open}
            onOpenChange={(open) => {
                if (!open) {
                    if (ref.current && !ref.current.contains(document.activeElement)) {
                        cancelChange();
                    }
                }
            }}
        >
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    className={`${value.length != 0 && "border-pink_primary text-pink_primary"}`}
                    onClick={() => setOpen(true)}
                >
                    {props.title}
                    <span>
                        <ChevronDown />
                    </span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className={`${
                    props.title == "Skills" ? "w-auto" : "w-64"
                } max-h-80 overflow-y-auto relative p-0`}
            >
                <DropdownMenuLabel className="sticky z-10 top-0 bg-white border-b border-gray-100">
                    {props.title}
                </DropdownMenuLabel>
                <DropdownMenuGroup
                    ref={ref}
                    className={`${props.title == "Skills" && "grid grid-cols-2 lg:grid-cols-3 gap-y-2"} mb-1`}
                >
                    {props.menuItems.map((item, index) => (
                        <DropdownMenuCheckboxItem
                            className={` group relative ${value.includes(item.value) && "text-pink_primary"}`}
                            key={index}
                            checked={value.includes(item.value)}
                            onCheckedChange={() => {
                                setValue((prev) => {
                                    if (prev.includes(item.value)) {
                                        return prev.filter((v) => v !== item.value);
                                    }
                                    return [...prev, item.value];
                                });
                            }}
                        >
                            <div className=" group-hover:text-pink_primary transition-all ">
                                <span>{item.label}</span>
                            </div>
                            <span className="absolute -bottom-1 left-0 w-0 transition-all h-0.5 bg-pink_primary group-hover:w-full"></span>
                        </DropdownMenuCheckboxItem>
                    ))}
                </DropdownMenuGroup>

                <div className="sticky bottom-0 bg-white p-2 grid grid-cols-2 gap-4 border-t border-gray-100">
                    <Button variant="outline" onClick={cancelChange}>
                        Cancel
                    </Button>
                    <Button
                        variant="default"
                        onClick={() => {
                            props.applyFilter?.(value);
                            setOpen(false);
                        }}
                    >
                        Confirm
                    </Button>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
