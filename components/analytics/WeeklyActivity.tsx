import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { ChartConfig, ChartContainer } from "../ui/chart";

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
  clips: {
    label: "Clips",
    color: "var(--chart-1)",
  },
  others: {
    label: "Others",
    color: "var(--chart-2)",
  },

} satisfies ChartConfig;

const WeeklyActivity = () => {
  return (
    <Card className="bg-card/80 backdrop-blur-sm border-border/50 ">
      <CardHeader>
        <CardTitle className="text-foreground">Weekly Activity</CardTitle>
      </CardHeader>
      <CardContent className="">
        <ChartContainer config={chartConfig} className="max-h-[400px]">
          <LineChart data={activityData} >
            {/* <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" /> */}

            <CartesianGrid strokeDasharray="3 3"  />

            <XAxis
              dataKey="name"
              fontSize={12}
              stroke="var(--muted-foreground)"
              
            />
            <YAxis fontSize={12} stroke="var(--muted-foreground)" />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
              }}
            />
            <Line
        
              type="monotone"
              dataKey="clips"
              strokeWidth={2}
              stroke="var(--color-clips)"
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default WeeklyActivity;
