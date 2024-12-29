"use client";
// import { CodingExerciseForm } from "@/components/admin/CodingExerciseForm";
import { ButtonCreateDialog } from "@/components/admin/study/ButtonCreateDialog";
import StudyCard from "@/components/study/study-card";
import { ELanguages } from "@/types/language";
import { useRouter } from "next/navigation";

export default function AdminStudyPage() {
    const router = useRouter();

    return (
        <div className="w-full h-full relative">
            <div className="lg:pr-14 lg:pl-10 px-8 pt-4 pb-8 space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <StudyCard
                        onClick={() => {
                            router.push("/admin/study/c");
                        }}
                        language={ELanguages.C}
                        exercises={82}
                    />
                    <StudyCard
                        onClick={() => {
                            router.push("/admin/study/java");
                        }}
                        language={ELanguages.Java}
                        exercises={82}
                    />
                    <StudyCard
                        onClick={() => {
                            router.push("/admin/study/cpp");
                        }}
                        language={ELanguages.Cpp}
                        exercises={82}
                    />
                </div>
            </div>
            {/* Add this ButtonCreateDialog positioned at the bottom-left */}
            <div className="absolute bottom-0 right-0 p-4">
                <ButtonCreateDialog />
            </div>
        </div>
    );
}
