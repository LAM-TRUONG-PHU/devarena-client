"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { useAppSelector } from "@/redux/hooks";
const chartConfig = {
    easy: {
        label: "easy",
        color: "#64CB41",
    },
    medium: {
        label: "medium",
        color: "#FFA500",
    },
    hard: {
        label: "hard",
        color: "#FF0000",
    },
} satisfies ChartConfig;

export function ChartDifficulty({ difficulties }: {
    difficulties?: {
        easy: number;
        medium: number;
        hard: number;
    }
}) {
    const chartData = [
        { difficulty: "", easy: difficulties?.easy, medium: difficulties?.medium, hard: difficulties?.hard },

    ]

    return (
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
            <BarChart accessibilityLayer data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                    dataKey="difficulty"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value.slice(0, 5)}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="easy" fill="#64CB41" radius={4} />
                <Bar dataKey="medium" fill="#FFA500" radius={4} />
                <Bar dataKey="hard" fill="#FF0000" radius={4} />
            </BarChart>
        </ChartContainer>
    );
}
