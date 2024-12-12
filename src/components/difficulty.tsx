import React from "react";

export default function Difficulty({ variant }: { variant: "easy" | "medium" | "hard" }) {
    return (
        <>
            <div
                style={{
                    color: variant === "easy" ? "#64CB41" : variant === "medium" ? "#FFA500" : "#FF0000",
                    backgroundColor:
                        variant === "easy" ? "#EFFAEB" : variant === "medium" ? "#FFF7E6" : "#FFECEC",
                }}
                className="rounded-xl font-semibold  h-fit  w-fit items-center flex text-xs py-1 px-4"
            >
                {variant[0].toUpperCase() + variant.slice(1)}
            </div>
        </>
    );
}
