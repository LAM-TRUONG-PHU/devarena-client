import { ELanguages } from "@/types/language";

export function getLanguageTitle(languages: ELanguages) {
    switch (languages) {
        case ELanguages.C:
            return "C";
        case ELanguages.Cpp:
            return "C++";
        case ELanguages.Java:
            return "Java";
        default:
            return "";
    }
}
