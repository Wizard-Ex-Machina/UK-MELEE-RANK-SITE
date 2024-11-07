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

export default function AboutItem({
  title,
  colorTailwind,
  description,
}: PropsWithChildren<RatingHistoryChartProps>) {
  return (
    <div className={`w-full rounded-md p-2 border-2 ${colorTailwind}`}>
      <h2 className="text-xl font-bold text-left pb-2">{title}</h2>
      <p>{description}</p>
    </div>
  );
}
