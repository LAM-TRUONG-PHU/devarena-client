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
type ChangeLanguageProps = {
    setLanguage: (language: ELanguages) => void;
};

export default function ChangeLanguage(props: ChangeLanguageProps) {
    const [language, setLanguage] = useState("C");

    useEffect(() => {
        props.setLanguage(language as ELanguages);
    }, [language]);

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
                    <DropdownMenuRadioGroup value={language} onValueChange={setLanguage}>
                        <DropdownMenuRadioItem value={ELanguages.C}>{ELanguages.C}</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value={ELanguages.Java}>
                            {ELanguages.Java}
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value={getLanguageTitle(ELanguages.Cpp)}>
                            {getLanguageTitle(ELanguages.Cpp)}
                        </DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
