import { getDB } from "@/lib/db";
import { calcGrowth, getGrowthStatus } from "@/lib/utils";
import { link } from "fs";
import { create } from "zustand";

type GrowthType = {
  total: number;
  growth: number;
  direction: string;
};

type CotentType = {
  name: string;
  value: number;
  fill: string;
};

type WeeklyActivity = {
  name: string;
  total: number;
};

type CartData = {
  date: string;
  text: number;
  link: number;
};

type AnalyticsStore = {
  totalClips: number;
  today: GrowthType;
  favorite: number;
  week: GrowthType;
  month: GrowthType;
  contentTypes: CotentType[];
  weeklyActivity: WeeklyActivity[];
  clipChartData: CartData[];
  getBarChartData: (range: string) => Promise<void>;
  getAnalytics: () => Promise<void>;
};

export const useAnalytics = create<AnalyticsStore>((set, get) => ({
  totalClips: 0,
  favorite: 0,
  today: { total: 0, growth: 0, direction: "" },
  week: { total: 0, growth: 0, direction: "" },
  month: { total: 0, growth: 0, direction: "" },
  contentTypes: [],
  weeklyActivity: [],
  clipChartData: [],

  getAnalytics: async () => {
    const db = await getDB();

    try {
      const data = await db.select(`SELECT COUNT(*) AS total,
        COUNT(CASE WHEN isFavorite = 1 THEN 1 END) AS totalFavorite,
        COUNT(CASE WHEN DATE(createdAt / 1000, 'unixepoch') = DATE('now') THEN 1 END) AS todayCount,
        COUNT(CASE WHEN DATE(createdAt / 1000, 'unixepoch') = DATE('now', '-1 day') THEN 1 END) AS yesterdayCount,
        COUNT(CASE WHEN strftime('%W', createdAt / 1000, 'unixepoch') = strftime('%W', 'now') THEN 1 END) AS thisWeekCount,
        COUNT(CASE WHEN strftime('%W', createdAt / 1000, 'unixepoch') = strftime('%W', 'now', '-7 days') THEN 1 END) AS lastWeekCount,
        COUNT(CASE WHEN strftime('%m', createdAt / 1000, 'unixepoch') = strftime('%m', 'now') THEN 1 END) AS thisMonthCount,
        COUNT(CASE WHEN strftime('%m', createdAt / 1000, 'unixepoch') = strftime('%m', 'now', '-1 month') THEN 1 END) AS lastMonthCount,
        COUNT(CASE WHEN type = 'text' THEN 1 END) AS textCount,
        COUNT(CASE WHEN type = 'link' THEN 1 END) AS linkCount 
        FROM clipboards`);

      const {
        total,
        todayCount,
        yesterdayCount,
        thisWeekCount,
        lastWeekCount,
        thisMonthCount,
        lastMonthCount,
        textCount,
        linkCount,
      } = data[0];

      const growthToday = calcGrowth(todayCount, yesterdayCount);
      const growthWeek = calcGrowth(thisWeekCount, lastWeekCount);
      const growthMonth = calcGrowth(thisMonthCount, lastMonthCount);

      const pct = (count: number) =>
        total > 0 ? Math.round((count / total) * 100).toFixed(0) : 0;


      const typeDistribution = [
        {
          name: "text",
          value: Number(pct(textCount)),
          fill: "var(--color-text)",
        },
        {
          name: "link",
          value: Number(pct(linkCount)),
          fill: "var(--color-link)",
        },
      ];

      const weekly = await db.select(`SELECT
      
        case cast (strftime('%w', createdAt / 1000, 'unixepoch') as integer)
        when 0 then 'Sun'
        when 1 then 'Mon'
        when 2 then 'Tue'
        when 3 then 'Wed'
        when 4 then 'Thu'
        when 5 then 'Fri'
        else 'Sat' end as weekday, 
        SUM(CASE WHEN type = 'text' THEN 1 ELSE 0 END) as text,
        SUM(CASE WHEN type = 'link' THEN 1 ELSE 0 END) as link
       FROM clipboards
       WHERE DATE(createdAt / 1000, 'unixepoch') >= DATE('now')
       GROUP BY DATE(createdAt / 1000, 'unixepoch')
       ORDER BY DATE(createdAt / 1000, 'unixepoch')`);
      
      
       set({
        totalClips: total,
        weeklyActivity:weekly,
        today: {
          total: todayCount,
          growth: growthToday,
          direction: getGrowthStatus(todayCount, yesterdayCount),
        },
        week: {
          total: thisWeekCount,
          growth: growthWeek,
          direction: getGrowthStatus(thisWeekCount, lastWeekCount),
        },
        month: {
          total: thisMonthCount,
          growth: growthMonth,
          direction: getGrowthStatus(thisMonthCount, lastMonthCount),
        },
        contentTypes: typeDistribution,
      });
    } catch (error) {
      console.log({ error });
    }

  },
  getBarChartData: async (range) => {
    try {
      const db = await getDB();

      const lastClips = await db.select(`
      SELECT 
      DATE(createdAt / 1000, 'unixepoch') AS date,
      SUM(CASE WHEN type = 'text' THEN 1 ELSE 0 END) as text,
      SUM(CASE WHEN type = 'link' THEN 1 ELSE 0 END) as link
      FROM clipboards
      WHERE DATE(createdAt / 1000, 'unixepoch') >= DATE('now', '${range}')
      GROUP BY DATE(createdAt / 1000, 'unixepoch')
      ORDER BY DATE(createdAt / 1000, 'unixepoch')
  `);
      set({
        clipChartData: lastClips,
      });
     
    } catch (error) {
      console.log({ error });
    }
  },
}));
