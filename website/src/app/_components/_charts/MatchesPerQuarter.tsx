// @ts-nocheck
"use client";
import { useState, useEffect } from "react";
import { Player } from "@/app/page";
import { ResponsiveLine, Line } from "@nivo/line";
import { format } from "path";
type chartProps = {
  color: string;
};
export default function MatchesPerQuarter({ color }: chartProps) {
  type RatingHistory = {
    MidDate: string;
    MatchCount: number;
  };

  const [history, setHistory] = useState<RatingHistory[]>([]),
    [loading, setLoading] = useState(false);

  useEffect(() => {
    async function getRatingHistory(min: number): Promise<RatingHistory[]> {
      const res = await fetch(`http://95.217.238.224:3001/matchesPerQuarter`);
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
        x: h.MidDate,
        y: h.MatchCount,
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
      xScale={{
        type: "time",
        format: "%Y-%m",
        precision: "month",
      }}
      curve="monotoneX"
      pointSize={5}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "Number of Matches",
        legendOffset: -40,
        legendPosition: "middle",
        truncateTickAt: 0,
      }}
      enableArea={true}
      tooltip={({ point }) => {
        return null;
      }}
      useMesh={true}
      enablePoints={true}
      margin={{ top: 10, right: 40, bottom: 60, left: 60 }}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        format: "%m-%y",
        tickRotation: 0,
        legend: "Date",
        legendOffset: 36,
        legendPosition: "middle",
        truncateTickAt: 0,
      }}
    />
  ) : null;
}
