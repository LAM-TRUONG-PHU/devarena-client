import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuCheckboxItem,
    DropdownMenuRadioItem,
    DropdownMenuRadioGroup,
} from "@/components/ui/dropdown-menu";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { ChevronDown } from "lucide-react";
import { ELanguages } from "@/types/language";
import { getLanguageTitle } from "@/utils/get-language-title";
import { set } from "react-hook-form";
import { useAppSelector } from "@/redux/hooks";
type ChangeLanguageProps = {
    setLanguage: (language: ELanguages) => void;
};

export default function ChangeLanguage(props: ChangeLanguageProps) {
    const [language, setLanguage] = useState("Java");
    const { algoExercise } = useAppSelector((state) => state.exercises);

    useEffect(() => {
        props.setLanguage(language as ELanguages);
        console.log(getLanguageTitle(capitalize(language) as ELanguages));
    }, [language]);


    const capitalize = (s: string) => {
        if (typeof s !== "string") return "";
        return s.charAt(0).toUpperCase() + s.slice(1);
    }
    return (
        <div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" className="!w-20">
                        {language} <ChevronDown />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                    <DropdownMenuSeparator />
                    <DropdownMenuRadioGroup value={
                        algoExercise.solutions?.find((solution) => solution.language === language)?.language
                    } onValueChange={
                        (value) => {
                            if (value === "C++")
                                value = "Cpp";
                            setLanguage(value as string);
                        }
                    }>
                        {algoExercise.solutions?.map((solution, index) => {
                            return (
                                <DropdownMenuRadioItem key={index} value={getLanguageTitle(capitalize(solution.language) as ELanguages)}>
                                    {getLanguageTitle(capitalize(solution.language) as ELanguages)}
                                </DropdownMenuRadioItem>
                            );
                        })}
                        {/* <DropdownMenuRadioItem value={ELanguages.C}>{ELanguages.C}</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value={ELanguages.Java}>
                            {ELanguages.Java}
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value={getLanguageTitle(ELanguages.Cpp)}>
                            {getLanguageTitle(ELanguages.Cpp)}
                        </DropdownMenuRadioItem> */}
                    </DropdownMenuRadioGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
