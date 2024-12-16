"use client";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuGroup,
    DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Filter, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { SortOptionTitle } from "@/app/(client)/study/[language]/page";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import useDifficultyFilter from "@/hooks/filter/use-difficulty-filter";
import useStatusFilter from "@/hooks/filter/use-status-filter";
import { EDifficulty, ESkills, EStatus } from "./sort";
import { X } from "lucide-react";
import useSkillsFilter from "@/hooks/filter/use-skills-filter";
type FilterProps<T = any> = {
    title: SortOptionTitle;
    menuItems: { label: string; value: T }[];
    applyFilter?: (difficulty: EDifficulty[], status: EStatus[], skills: ESkills[]) => void;
    // selected: T[];
};

export function MainFilter<T>(props: FilterProps<T>) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const statusFilter = useStatusFilter();
    const difficultyFilter = useDifficultyFilter();
    const skillsFilter = useSkillsFilter();

    const [valueFilter, setValueFilter] = useState<[EStatus[], EDifficulty[], ESkills[]]>([
        statusFilter.selected,
        difficultyFilter.selected,
        skillsFilter.selected,
    ]);
    const menuItemsStatus = statusFilter.menuItems.filter((item) => {
        return statusFilter.selected.includes(item.value);
    });

    const menuItemsDifficulty = difficultyFilter.menuItems.filter((item) => {
        return difficultyFilter.selected.includes(item.value);
    });

    const menuItemsSkills = skillsFilter.menuItems.filter((item) => {
        return skillsFilter.selected.includes(item.value);
    });

    const menuItems = [
        { title: "Status", menuItems: menuItemsStatus },
        { title: "Difficulty", menuItems: menuItemsDifficulty },
        { title: "Skills", menuItems: menuItemsSkills },
    ];

    function cancelChange() {
        setValueFilter([statusFilter.selected, difficultyFilter.selected, skillsFilter.selected]);
        setOpen(false);
    }

    useEffect(() => {
        setValueFilter([statusFilter.selected, difficultyFilter.selected, skillsFilter.selected]);
    }, [statusFilter.selected, difficultyFilter.selected, skillsFilter.selected]);

    // useEffect(() => {
    //     console.log("valueFilter", valueFilter);
    // }, [valueFilter]);

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
                <Button variant="outline" className="relative" onClick={() => setOpen(true)}>
                    <span>
                        <Filter />
                    </span>
                    <div className="absolute -top-2 right-1 rounded-full bg-pink_primary aspect-square w-4 text-xs text-white">
                        <div>{valueFilter[0].length + valueFilter[1].length + valueFilter[2].length}</div>
                    </div>

                    {props.title}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>{props.title}</DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuGroup ref={ref}>
                    {menuItems.map((item, index) => (
                        <div key={index}>
                            <span className="text-sm font-medium  pl-2 text-pink_primary flex justify-center">
                                {item.title}
                            </span>
                            {item.menuItems.length === 0 && (
                                <div className="px-1 text-sm flex gap-2 items-center text-gray-400">
                                    <X size={20} />
                                    No items found
                                </div>
                            )}
                            {item.menuItems.map((items, index) => (
                                <DropdownMenuCheckboxItem
                                    key={index}
                                    checked={
                                        item.title === "Status"
                                            ? valueFilter[0].includes(items.value as EStatus)
                                            : item.title === "Difficulty"
                                            ? valueFilter[1].includes(items.value as EDifficulty)
                                            : valueFilter[2].includes(items.value as ESkills)
                                    }
                                    onCheckedChange={() => {
                                        setValueFilter(([status, difficulty, skills]) => {
                                            if (item.title === "Status") {
                                                const isSelected = status.includes(items.value as EStatus);
                                                const newStatus = isSelected
                                                    ? status.filter((v) => v !== (items.value as EStatus))
                                                    : [...status, items.value as EStatus];
                                                console.log("status", newStatus);
                                                return [newStatus, difficulty, skills];
                                            } else if (item.title === "Difficulty") {
                                                const isSelected = difficulty.includes(
                                                    items.value as EDifficulty
                                                );
                                                const newDifficulty = isSelected
                                                    ? difficulty.filter(
                                                          (v) => v !== (items.value as EDifficulty)
                                                      )
                                                    : [...difficulty, items.value as EDifficulty];
                                                console.log("difficulty", newDifficulty);
                                                return [status, newDifficulty, skills];
                                            } else if (item.title === "Skills") {
                                                const isSelected = skills.includes(items.value as ESkills);
                                                const newSkills = isSelected
                                                    ? skills.filter((v) => v !== (items.value as ESkills))
                                                    : [...skills, items.value as ESkills];
                                                console.log("skills", newSkills);
                                                return [status, difficulty, newSkills];
                                            }
                                            return [status, difficulty, skills];
                                        });
                                    }}
                                >
                                    <span>{items.label}</span>
                                </DropdownMenuCheckboxItem>
                            ))}
                        </div>
                    ))}
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <div className=" grid grid-cols-2 gap-4 p-2">
                    <Button variant="outline" onClick={cancelChange}>
                        Cancel
                    </Button>
                    <Button
                        variant="default"
                        onClick={() => {
                            props.applyFilter?.(valueFilter[1], valueFilter[0], valueFilter[2]);
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
