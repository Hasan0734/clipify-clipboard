"use client";

import * as React from "react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import { useIsMobile } from "@/hooks/use-mobile";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useAnalytics } from "@/store/useAnalytics";

export const description = "An interactive area chart";

const chartConfig = {
  clips: {
    label: "Clips",
  },
  date: {
    label: "Date",
    color: "var(--chart-1)",
  },
  link: {
    label: "Links",
    color: "var(--chart-1)",
  },
  text: {
    label: "Text",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

export function ChartAreaInteractive() {
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = React.useState("-7 days");
  const {getBarChartData, clipChartData} = useAnalytics();

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("-7 days");
      getBarChartData('-7 days')
    }
  }, [isMobile]);

  React.useEffect(() => {
    getBarChartData(timeRange)
  }, [timeRange])


  const handleOnChange = (range: string) => {
    setTimeRange(range);



  };

  return (
    <Card className="@container/card  bg-card/80">
      <CardHeader>
        <CardTitle>Total Clips</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Total for the last{" "}
            {timeRange === "-7 days"
              ? "7 days"
              : timeRange === "-30 days"
              ? "30 days"
              : "3 months"}
          </span>
          <span className="@[540px]/card:hidden">Last {timeRange === "-7 days"
              ? "7 days"
              : timeRange === "-30 days"
              ? "30 days"
              : "3 months"}</span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={handleOnChange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="-90 days">Last 3 months</ToggleGroupItem>
            <ToggleGroupItem value="-30 days">Last 30 days</ToggleGroupItem>
            <ToggleGroupItem value="-7 days">Last 7 days</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={handleOnChange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="-90 days" className="rounded-lg">
                Last 3 months
              </SelectItem>
              <SelectItem value="-30 days" className="rounded-lg">
                Last 30 days
              </SelectItem>
              <SelectItem value="-7 days" className="rounded-lg">
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>

      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          {/* <AreaChart data={chartData}>
            <defs>
              <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-clips)"
                  stopOpacity={1.0}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-date)"
                  stopOpacity={0.1}
                />
              </linearGradient>
             
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value:string) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value:string) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                  indicator="dot"
                />
              }
            />
 
            <Area
              dataKey="clips"
              type="natural"
              fill="url(#fillDesktop)"
              stroke="var(--color-date)"
              stackId="a"
            />
          </AreaChart> */}

          <BarChart
            accessibilityLayer
            data={clipChartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value: string) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />

            <ChartTooltip
              content={
                <ChartTooltipContent
                  cursor={false}
                  indicator="dashed"
                  className="w-[150px]"
                  labelFormatter={(value: string) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });
                  }}
                />
              }
            />
            <Bar dataKey={"text"} fill={`var(--color-text)`} />
            <Bar dataKey={"link"} fill={`var(--color-link)`} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
