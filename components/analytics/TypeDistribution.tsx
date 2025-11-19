import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "../ui/card";
import {
  PieChart,
  Pie,
  LabelList,
  PieLabelRenderProps,
  TooltipContentProps,
} from "recharts";
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

  const RADIAN = Math.PI / 180;
  
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    name,
    percent,
  }: PieLabelRenderProps) => {

    if (
      cx == null ||
      cy == null ||
      innerRadius == null ||
      outerRadius == null
    ) {
      return null;
    }
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const ncx = Number(cx);
    const x = ncx + radius * Math.cos(-(midAngle ?? 0) * RADIAN);
    const ncy = Number(cy);
    const y = ncy + radius * Math.sin(-(midAngle ?? 0) * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > ncx ? "start" : "end"}
        dominantBaseline="central"
      >
        {`${name.charAt(0).toUpperCase() + name.slice(1)} ${(
          (percent ?? 1) * 100
        ).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <Card className="flex flex-col bg-card/80">
      <CardHeader className="items-center pb-0">
        <CardTitle>Content types</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[300px] 2xl:max-h-[350px] pb-0"
        >
          <PieChart>
            {/* <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="dashed"
                  payload={[]}
                />
              }
            /> */}
            <Pie
              data={typeDistribution}
              label={renderCustomizedLabel}
              labelLine={false}

            ></Pie>
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
