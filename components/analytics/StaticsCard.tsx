import React from "react";
import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";
import { NumericFormat } from "react-number-format";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { Badge } from "../ui/badge";

type CardProps = {
  total: number;
  title: string;
  Icon?: LucideIcon;
  growth?: number;
  direction?: string;
  text: string;
};

const StaticsCard = ({
  total,
  title,
  Icon,
  growth,
  direction,
  text,
}: CardProps) => {
  return (
    <Card className="@container/card relative bg-card/80">
      <CardHeader>
        <CardDescription>{title}</CardDescription>
        <CardTitle className="text-2xl font-bold tabular-nums @[250px]/card:text-3xl">
          <NumericFormat
            displayType="text"
            value={total}
            thousandSeparator=","
          />
        </CardTitle>
        <CardAction>
          {Icon ? (
            <Icon />
          ) : (
            <Badge variant={direction === "up" ? "default" : "destructive"}>
              {direction === "up" ? <IconTrendingUp /> : <IconTrendingDown />}
              {growth?.toFixed()}%
            </Badge>
          )}
        </CardAction>

        <div className="absolute right-4 bottom-3 opacity-50">
          {direction === "up" && (
            <IconTrendingUp className="size-16 text-primary" />
          )}
              {direction === "down" && (
            <IconTrendingDown className="size-16 text-primary" />
          )}
        </div>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1.5 text-sm">
        <div className="line-clamp-1 flex gap-2 font-medium text-muted-foreground">
          {growth && direction && (
            <span>
              <span className="capitalize">{direction}</span>{" "}
              {growth?.toFixed()}% from 
            </span>
          )}{" "}
          {text}
        </div>
      </CardFooter>
    </Card>
  );
};

export default StaticsCard;
