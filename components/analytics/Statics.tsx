import { useAnalytics } from "@/store/useAnalytics";
import StaticsCard from "./StaticsCard";
import {  Copy } from "lucide-react";

const Statics = () => {
  const { totalClips, today, week, month } = useAnalytics();


  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <StaticsCard text="All clipboards" title={"Total Clips"} total={totalClips} Icon={Copy} />
      <StaticsCard
        title={"Today Clip's"}
        total={today.total}
        growth={today.growth}
        direction={today.direction}
        text="yesterday"
      />
      <StaticsCard
        title={"This Week"}
        total={week.total}
        growth={week.growth}
        direction={week.direction}
        text="last week"
      />
      <StaticsCard
        title={"This Month"}
        total={month.total}
        growth={month.growth}
        direction={month.direction}
        text="last month"
      />

      {/* <Card className="@container/card">
        <CardHeader>
          <CardDescription>Active Accounts</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            45,678
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +12.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Strong user retention <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Engagement exceed targets</div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Growth Rate</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            4.5%
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +4.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Steady performance increase <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Meets growth projections</div>
        </CardFooter>
      </Card> */}
    </div>
  );
};

export default Statics;
