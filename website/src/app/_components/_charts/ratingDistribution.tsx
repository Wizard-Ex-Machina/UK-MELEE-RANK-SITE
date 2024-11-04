"use client";
import { useState, useEffect } from "react";
import { Player } from "@/app/page";
import { ResponsiveLine, Line } from "@nivo/line";
import { format } from "path";
type chartProps = {
  color: string;
};
export default function RatingDistribution({ color }: chartProps) {
  type RatingHistory = {
    RatingRange: number;
    Frequency: number;
  };

  const [history, setHistory] = useState<RatingHistory[]>([]),
    [loading, setLoading] = useState(false);

  useEffect(() => {
    async function getRatingHistory(min: number): Promise<RatingHistory[]> {
      const res = await fetch(`http://localhost:8080/ratingDistruibtion`);
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
        y: h.Frequency,
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
        max: "120",
      }}
      xScale={{
        type: "linear",
        min: "1625",
        max: "3225",
      }}
      tooltip={({ point }) => {
        return null;
      }}
      gridYValues={[20, 40, 60, 80, 100]}
      curve="basis"
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "Number of Players",
        legendOffset: -40,
        legendPosition: "middle",
        truncateTickAt: 0,
      }}
      enableArea={true}
      useMesh={true}
      enablePoints={false}
      margin={{ top: 10, right: 40, bottom: 60, left: 60 }}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "Rating",
        legendOffset: 36,
        legendPosition: "middle",
        truncateTickAt: 0,
      }}
    />
  ) : null;
}
