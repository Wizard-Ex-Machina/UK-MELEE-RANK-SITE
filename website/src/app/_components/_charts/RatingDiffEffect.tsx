// @ts-nocheck
"use client";
import { useState, useEffect } from "react";
import { Player } from "@/app/page";
import { ResponsiveLine, Line } from "@nivo/line";
import { format } from "path";
type chartProps = {
  color: string;
};
export default function RatingDifferenceChart({ color }: chartProps) {
  type RatingHistory = {
    RatingRange: number;
    WinRate: number;
  };

  const [history, setHistory] = useState<RatingHistory[]>([]),
    [loading, setLoading] = useState(false);

  useEffect(() => {
    async function getRatingHistory(min: number): Promise<RatingHistory[]> {
      const res = await fetch(
        `https://meleeranked.uk/api/winRateByRatingDifference/${min}`,
      );
      const data = await res.json();
      return data;
    }
    getRatingHistory(0).then((data) => {
      setHistory(data.reverse());
      setLoading(true);
    });
  }, ["nothing"]);

  const data = [
    {
      id: "Win Rate",
      data: history.map((h) => ({
        x: h.RatingRange,
        y: h.WinRate,
      })),
    },
  ];

  return loading ? (
    <ResponsiveLine
      colors={[color]}
      data={data}
      theme={{
        text: {
          font: "sans-serif",
          fill: "white",
        },
      }}
      yScale={{
        type: "linear",
        min: "0",
        max: "100",
      }}
      xScale={{
        type: "linear",
        min: "-575",
        max: "575",
      }}
      curve="basis"
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "Win Rate",
        legendOffset: -40,
        legendPosition: "middle",
        truncateTickAt: 0,
      }}
      enableArea={true}
      tooltip={({ point }) => {
        return null;
      }}
      useMesh={true}
      enablePoints={false}
      margin={{ top: 10, right: 40, bottom: 60, left: 60 }}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "Rating Difference",
        legendOffset: 36,
        legendPosition: "middle",
        truncateTickAt: 0,
      }}
    />
  ) : null;
}
