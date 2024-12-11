import React from "react";

export default function Difficulty({ variant }: { variant: "easy" | "medium" | "hard" }) {
    return (
        <>
            <div
                style={{
                    color: variant === "easy" ? "#2BC672" : variant === "medium" ? "#FFA500" : "#FF0000",
                    borderColor:
                        variant === "easy" ? "#2BC672" : variant === "medium" ? "#FFA500" : "#FF0000",
                    backgroundColor:
                        variant === "easy" ? "#EFFFF1" : variant === "medium" ? "#FFF7E6" : "#FFECEC",
                }}
                className="rounded-full border h-fit  w-fit items-center flex text-xs py-1 px-5"
            >
                {variant[0].toUpperCase() + variant.slice(1)}
            </div>
        </>
    );
}
