// @ts-nocheck
"use client";
import { useState, useEffect } from "react";
import { Player } from "@/app/page";
import { ResponsiveLine, Line } from "@nivo/line";
import { format } from "path";

type RatingHistoryChartProps = {
  player: Player;
};
function getColor(percentile: number) {
  let color = "#ef4444";
  if (percentile > 5) {
    color = "#6366f1";
  }
  if (percentile > 12.5) {
    color = "#10b981";
  }
  if (percentile > 30) {
    color = "#06b6d4";
  }
  if (percentile > 47.5) {
    color = "#eab308";
  }
  if (percentile > 65) {
    color = "#64748b";
  }
  if (percentile > 82.5) {
    color = "#ea580c";
  }
  return color;
}
export default function RatingHistoryChart(props: RatingHistoryChartProps) {
  type RatingHistory = {
    TournamentName: string;
    Rating: number;
    Date: string;
  };

  const [history, setHistory] = useState<RatingHistory[]>([]),
    [loading, setLoading] = useState(false);

  useEffect(() => {
    async function getRatingHistory(id: number): Promise<RatingHistory[]> {
      const res = await fetch(`http://localhost:8080/ratingHistory/${id}`);
      const data = await res.json();
      return data;
    }
    getRatingHistory(props.player.PlayerID).then((data) => {
      setHistory(data);
      setLoading(true);
    });
  }, [props.player.PlayerID]);
  const data = [
    {
      id: "Rating",
      data: history.map((h) => ({
        x: h.Date.split(" ")[0],
        y: h.Rating,
        name: h.TournamentName,
      })),
    },
  ];
  const color = getColor(props.player.Percentile);
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
        max: "3250",
      }}
      gridYValues={[0, 500, 1000, 1500, 2000, 2500, 3000]}
      xScale={{
        type: "time",
        format: "%Y-%m-%d",
        precision: "day",
      }}
      axisLeft={{
        tickValues: [0, 500, 1000, 1500, 2000, 2500, 3000],
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "Rating",
        legendOffset: -40,
        legendPosition: "middle",
        truncateTickAt: 0,
      }}
      enableArea={true}
      pointSize={5}
      margin={{ top: 10, right: 50, bottom: 60, left: 60 }}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        format: "%m-%y",
        legend: "Date",
        legendOffset: 36,
        legendPosition: "middle",
        truncateTickAt: 0,
      }}
      isInteractive={true}
      useMesh={true}
      tooltip={({ point }) => (
        <div className="bg-slate-500/25 rounded-md p-2 text-white">
          <div>{point.data.name}</div>
        </div>
      )}
    />
  ) : null;
}
