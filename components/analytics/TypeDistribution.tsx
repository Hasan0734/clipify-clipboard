import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "../ui/card";
import { PieChart, Pie, LabelList } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "../ui/chart";
import { useAnalytics } from "@/store/useAnalytics";

// const typeDistribution = [
//   { name: "Text", value: 90, fill: "var(--color-text)" },
//   { name: "Links", value: 10, fill: "var(--color-link)" },
// ];
const chartConfig = {
  text: {
    label: "Text",
    color: "var(--chart-3)",
  },
  link: {
    label: "Link",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

const TypeDistribution = () => {
  const typeDistribution = useAnalytics((st) => st.contentTypes);

  console.log(typeDistribution);

  return (
    <Card className="flex flex-col bg-card/80">
      <CardHeader className="items-center pb-0">
        <CardTitle>Content types</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px] pb-0"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                 indicator="dashed" 
                 
                  />
              }
            />
            <Pie
              data={typeDistribution}
              dataKey="value"
              // label={({ name, percent }: { name: string; percent: number }) =>
              //   `${name} ${(percent * 100).toFixed(0)}%`
              // }
              // outerRadius={80}
              // labelLine={false}
            />
            <LabelList
              dataKey="name"
              nameKey="name"
              className="fill-background"
              stroke="none"
              fontSize={12}
              formatter={(value: keyof typeof chartConfig) =>
                chartConfig[value]?.label
              }
            />
            <ChartLegend
              content={
                <ChartLegendContent
                  nameKey={"name"}
                  payload={undefined}
                  verticalAlign={undefined}
                />
              }
              className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
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
