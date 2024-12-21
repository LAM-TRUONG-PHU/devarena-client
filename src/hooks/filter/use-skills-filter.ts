import { ESkills } from "@/components/sort";
import React from "react";
import useSearchQuery from "../use-search-query";

const menuItems = [
    { label: "Array", value: ESkills.Array },
    { label: "String", value: ESkills.String },
    { label: "Hash Table", value: ESkills["Hash Table"] },
    { label: "Dynamic Programming", value: ESkills["Dynamic Programming"] },
    { label: "Math", value: ESkills.Math },
    { label: "Sorting", value: ESkills.Sorting },
    { label: "Greedy", value: ESkills.Greedy },
    { label: "Depth-First Search", value: ESkills["Depth-First Search"] },
    { label: "Database", value: ESkills.Database },
    { label: "Binary Search", value: ESkills["Binary Search"] },
    { label: "Matrix", value: ESkills.Matrix },
    { label: "Tree", value: ESkills.Tree },
    { label: "Breadth-First Search", value: ESkills["Breadth-First Search"] },
    { label: "Bit Manipulation", value: ESkills["Bit Manipulation"] },
    { label: "Two Pointers", value: ESkills["Two Pointers"] },
    { label: "Prefix Sum", value: ESkills["Prefix Sum"] },
    { label: "Heap (Priority Queue)", value: ESkills["Heap (Priority Queue)"] },
    { label: "Binary Tree", value: ESkills["Binary Tree"] },
    { label: "Simulation", value: ESkills.Simulation },
    { label: "Stack", value: ESkills.Stack },
    { label: "Graph", value: ESkills.Graph },
    { label: "Counting", value: ESkills.Counting },
    { label: "Sliding Window", value: ESkills["Sliding Window"] },
    { label: "Design", value: ESkills.Design },
    { label: "Backtracking", value: ESkills.Backtracking },
    { label: "Enumeration", value: ESkills.Enumeration },
    { label: "Union Find", value: ESkills["Union Find"] },
    { label: "Linked List", value: ESkills["Linked List"] },
    { label: "Number Theory", value: ESkills["Number Theory"] },
    { label: "Ordered Set", value: ESkills["Ordered Set"] },
    { label: "Monotonic Stack", value: ESkills["Monotonic Stack"] },
    { label: "Trie", value: ESkills.Trie },
    { label: "Segment Tree", value: ESkills["Segment Tree"] },
    { label: "Bitmask", value: ESkills.Bitmask },
    { label: "Queue", value: ESkills.Queue },
    { label: "Divide and Conquer", value: ESkills["Divide and Conquer"] },
    { label: "Recursion", value: ESkills.Recursion },
    { label: "Combinatorics", value: ESkills.Combinatorics },
    { label: "Binary Indexed Tree", value: ESkills["Binary Indexed Tree"] },
    { label: "Geometry", value: ESkills.Geometry },
    { label: "Binary Search Tree", value: ESkills["Binary Search Tree"] },
    { label: "Hash Function", value: ESkills["Hash Function"] },
    { label: "Memoization", value: ESkills.Memoization },
    { label: "String Matching", value: ESkills["String Matching"] },
    { label: "Topological Sort", value: ESkills["Topological Sort"] },
    { label: "Shortest Path", value: ESkills["Shortest Path"] },
    { label: "Rolling Hash", value: ESkills["Rolling Hash"] },
    { label: "Game Theory", value: ESkills["Game Theory"] },
    { label: "Interactive", value: ESkills.Interactive },
    { label: "Data Stream", value: ESkills["Data Stream"] },
    { label: "Monotonic Queue", value: ESkills["Monotonic Queue"] },
    { label: "Brainteaser", value: ESkills.Brainteaser },
    { label: "Randomized", value: ESkills.Randomized },
    { label: "Merge Sort", value: ESkills["Merge Sort"] },
    { label: "Doubly-Linked List", value: ESkills["Doubly-Linked List"] },
    { label: "Counting Sort", value: ESkills["Counting Sort"] },
    { label: "Iterator", value: ESkills.Iterator },
    { label: "Concurrency", value: ESkills.Concurrency },
    { label: "Probability and Statistics", value: ESkills["Probability and Statistics"] },
    { label: "Quickselect", value: ESkills.Quickselect },
    { label: "Suffix Array", value: ESkills["Suffix Array"] },
    { label: "Bucket Sort", value: ESkills["Bucket Sort"] },
];

export default function useSkillsFilter() {
    const { searchQuery, setSearchQuery } = useSearchQuery();

    const selected = React.useMemo(() => {
        return (searchQuery.get("skills")?.split(",") ?? []) as ESkills[];
    }, [searchQuery]);

    const applySkillsFilter = React.useCallback(
        (skills: ESkills[]) => {
            setSearchQuery("skills", skills);
        },
        [setSearchQuery]
    );
    return { applySkillsFilter, menuItems, searchQuery, selected };
}
