import { ELanguages } from "@/types/language";

export function isValidLanguage(language: any): language is ELanguages {
    return Object.values(ELanguages).includes(language);
}
