import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "../ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";
import { useAnalytics } from "@/store/useAnalytics";
import { link } from "fs";
import { TrendingUp } from "lucide-react";
import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";

// Mock data for analytics
const activityData = [
  { name: "Mon", clips: 12 },
  { name: "Tue", clips: 19 },
  { name: "Wed", clips: 15 },
  { name: "Thu", clips: 25 },
  { name: "Fri", clips: 22 },
  { name: "Sat", clips: 8 },
  { name: "Sun", clips: 10 },
];

const chartConfig = {
  text: {
    label: "Text",
    color: "var(--chart-1)",
  },
  link: {
    label: "Link",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

const WeeklyActivity = () => {
  const activityData = useAnalytics((st) => st.weeklyActivity);
  const { week } = useAnalytics();

  return (
    <Card className="bg-card/80 backdrop-blur-sm border-border/50 ">
      <CardHeader>
        <CardTitle className="text-foreground">Weekly Activity</CardTitle>
      </CardHeader>
      <CardContent className="">
        <ChartContainer config={chartConfig}>
          <LineChart data={activityData}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis
              dataKey="weekday"
              fontSize={12}
              stroke="var(--muted-foreground)"
            />
            <YAxis fontSize={12} stroke="var(--muted-foreground)" />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line
              type="monotone"
              dataKey="text"
              strokeWidth={2}
              stroke="var(--color-text)"
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="link"
              strokeWidth={2}
              stroke="var(--color-link)"
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Trending {week.direction} by {week.growth.toFixed()}% this week{" "}
          {week.direction === "up" && (
            <IconTrendingUp className="size-4 text-primary" />
          )}
          {week.direction === "down" && (
            <IconTrendingDown className="size-4 text-primary" />
          )}
        </div>ƒ
      </CardFooter>
    </Card>
  );
};

export default WeeklyActivity;
