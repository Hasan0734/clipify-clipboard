import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "../ui/card";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";
import { useAnalytics } from "@/store/useAnalytics";

// const typeDistribution = [
//   { name: "Text", value: 45, fill: "var(--color-text)" },
//   { name: "Links", value: 30, fill: "var(--color-link)" },
// ];


const TypeDistribution = () => {
  const contentTypes = useAnalytics(st => st.contentTypes);

  console.log(contentTypes)

  const chartConfig = {
  text: {
    label: "Text",
    color: "var(--chart-1)",
  },
  link: {
    label: "Link",
    color: "var(--chart-2)",
  },
  other: {
    label: "Other",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig;

  
  return (
    <Card className="flex flex-col bg-card/80">
      <CardHeader className="items-center pb-0">
        <CardTitle>Content types</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex items-center pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={contentTypes}
              dataKey="value"
              nameKey="name"
              label={({ name, percent }: { name: string; percent: number }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
              outerRadius={100}
              labelLine={false}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default TypeDistribution;
