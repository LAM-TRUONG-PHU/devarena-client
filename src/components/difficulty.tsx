import React from "react";
import { EDifficulty } from "./sort";

export default function Difficulty({ variant }: { variant: EDifficulty }) {
    return (
        <>
            <div
                style={{
                    color:
                        variant === EDifficulty.Easy
                            ? "#64CB41"
                            : variant === EDifficulty.Medium
                            ? "#FFA500"
                            : "#FF0000",
                    backgroundColor:
                        variant === EDifficulty.Easy
                            ? "#EFFAEB"
                            : variant === EDifficulty.Medium
                            ? "#FFF7E6"
                            : "#FFECEC",
                }}
                className="rounded-xl font-semibold  h-fit  w-fit items-center flex text-xs py-1 px-4"
            >
                {variant[0].toUpperCase() + variant.slice(1)}
            </div>
        </>
    );
}
