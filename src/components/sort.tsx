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
import { SortOptionTitle } from "@/app/(client)/study/[exercise]/page";
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

export enum Skills {}

type Checked = DropdownMenuCheckboxItemProps["checked"];

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
        console.log(value);
    }, [value]);
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
                    {props.isFilter && (
                        <>
                            <span>
                                <Filter />
                            </span>
                            <div className="absolute -top-2 right-1 rounded-full bg-pink_primary aspect-square w-4 text-xs text-white">
                                8
                            </div>
                        </>
                    )}

                    {props.title}
                    {!props.isFilter && (
                        <span>
                            <ChevronDown />
                        </span>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>{props.title}</DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuGroup ref={ref}>
                    {props.menuItems.map((item, index) => (
                        <DropdownMenuCheckboxItem
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
                            <span>{item.label}</span>
                        </DropdownMenuCheckboxItem>
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
