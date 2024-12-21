import { ELanguages } from "@/types/language";

export function getLanguageValue(languages: ELanguages) {
    switch (languages) {
        case ELanguages.C:
            return "c";
        case ELanguages.Cpp:
            return "cpp";
        case ELanguages.Java:
            return "java";
        default:
            return "";
    }
}
