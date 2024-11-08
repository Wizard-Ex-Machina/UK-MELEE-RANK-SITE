// @ts-nocheck
"use client";
import { ResponsiveScatterPlot } from "@nivo/scatterplot";
import { useEffect, useState } from "react";
type props = {
  color: string;
};
export default function AttendiesPerEvent({ color }: props) {
  type Event = {
    EventDate: string;
    TouranmentID: number;
    TouranmentName: string;
    TotalPlayers: number;
  };

  const [history, setHistory] = useState<Event[]>([]),
    [loading, setLoading] = useState(false);

  useEffect(() => {
    async function getEvent(): Promise<Event[]> {
      const res = await fetch(`https://meleeranked.uk/api/eventAttendance`);
      const data = await res.json();
      return data;
    }
    getEvent().then((data) => {
      setHistory(data);
      setLoading(true);
    });
  }, [null]);
  const data = [
    {
      id: "Rating",
      data: history.map((h) => ({
        x: h.EventDate.split(" ")[0],
        y: h.TotalPlayers,
        name: h.TouranmentName,
      })),
    },
  ];
  return (
    <ResponsiveScatterPlot
      data={data}
      margin={{ top: 60, right: 40, bottom: 70, left: 90 }}
      xScale={{
        type: "time",
        format: "%Y-%m-%d",
        precision: "day",
      }}
      theme={{
        text: {
          font: "sans-serif",
          fill: "white",
        },
      }}
      colors={[color]}
      yScale={{ type: "log", min: 5, max: "auto" }}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        format: "%m-%y",
        tickRotation: 0,
        legend: "Date",
        legendPosition: "middle",
        legendOffset: 36,
        truncateTickAt: 0,
      }}
      nodeSize={3}
      gridYValues={[1, 5, 10, 20, 40, 80, 160, 320, 640]}
      axisLeft={{
        tickValues: [1, 5, 10, 20, 40, 80, 160, 320, 640],
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "Attending Players",
        legendPosition: "middle",
        legendOffset: -40,
        truncateTickAt: 0,
      }}
      tooltip={({ node }) => (
        <div className="bg-slate-500/25 rounded-md p-2 text-white">
          <strong>{node.data.name}</strong>
        </div>
      )}
    />
  );
}
