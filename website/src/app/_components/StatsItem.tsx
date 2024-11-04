"use client";
import { useState, useEffect } from "react";
import { Player } from "@/app/page";
import { ResponsiveLine, Line } from "@nivo/line";
import { format } from "path";
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
