"use client"

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { useAppSelector } from "@/redux/hooks"


export const formatDate = (dateString: string) => {
    const date = new Date(dateString);

    // Extract day, month, year, hours, minutes, and seconds
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    // Construct the formatted string
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
};


const chartConfig = {
    runtime: {
        label: "Runtime",
        color: "#2563eb",
    },

} satisfies ChartConfig

export function ChartRuntime() {
    const { subList } = useAppSelector(state => state.exercises)
    const sortedSubList = [...subList]
        .sort((a, b) => a.totalTime - b.totalTime)
        .slice(0, 5);

    // Map sorted submissions to chart data
    const chartData = sortedSubList.map(submission => ({
        date: formatDate(submission.createdAt),
        runtime: submission.totalTime / 1000,
    }));


    return (
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
            <BarChart accessibilityLayer data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                    dataKey="date"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value.slice(0, 5)}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="runtime" fill="#2563eb" radius={4} />
            </BarChart>
        </ChartContainer>
    )
}
