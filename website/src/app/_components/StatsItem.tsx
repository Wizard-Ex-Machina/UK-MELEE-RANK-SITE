"use client";
import { PropsWithChildren } from "react";

type RatingHistoryChartProps = {
  title: string;
  description: string;
  colorTailwind: string;
};

export default function StatsItem({
  title,
  colorTailwind,
  description,
  children,
}: PropsWithChildren<RatingHistoryChartProps>) {
  return (
    <div className={`w-full rounded-md p-2 border-2 ${colorTailwind}`}>
      <h2 className="text-xl font-bold text-center">{title}</h2>
      <div className="w-full h-96"> {children}</div>
      <p>{description}</p>
    </div>
  );
}
