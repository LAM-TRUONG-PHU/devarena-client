import React from "react";
import { EDifficulty } from "./sort";

export default function Difficulty({ variant, isProfile, value }: { variant: EDifficulty; isProfile?: boolean; value?: number }) {
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
                className={`rounded-xl ${isProfile ? "font-medium gap-4 w-full" : "w-fit font-semibold"
                    }  h-fit   items-center justify-between flex text-xs py-1 px-4`}
            >
                {variant[0].toUpperCase() + variant.slice(1)}{" "}
                {isProfile && <div className="font-semibold">{value}</div>}
            </div>
        </>
    );
}
