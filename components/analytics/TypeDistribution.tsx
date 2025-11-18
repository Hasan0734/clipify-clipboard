import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "../ui/card";
import { PieChart, Pie } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";
import { useAnalytics } from "@/store/useAnalytics";

// const typeDistribution = [
//   { name: "Text", value: 90, fill: "var(--color-text)" },
//   { name: "Links", value: 10, fill: "var(--color-link)" },
// ];
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

const TypeDistribution = () => {
  const typeDistribution = useAnalytics((st) => st.contentTypes);

  return (
    <Card className="flex flex-col bg-card/80">
      <CardHeader className="items-center pb-0">
        <CardTitle>Content types</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[350px] pb-0"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={typeDistribution}
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
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Showing percentage of text and link.
        </div>
      </CardFooter>
    </Card>
  );
};

export default TypeDistribution;
