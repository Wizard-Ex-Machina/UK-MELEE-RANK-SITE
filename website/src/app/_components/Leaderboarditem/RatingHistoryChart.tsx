import { ResponsiveLine, Line } from "@nivo/line";
import { useState, useMemo, useEffect } from "react";

export default function RatingHistoryChart({
  id,
  percentile,
}: {
  id: string;
  percentile: number;
}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Fetching rating history data...");
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/player/rating-history?player=${id}`,
    ).then((data) => {
      data.json().then((data) => {
        setData([
          {
            id: "Rating",
            data: data.map((h: any) => ({
              x: h.endAt,
              y: h.r,
              name: h.tournament,
            })),
          },
        ]);
        setLoading(false);
      });
    });
  }, []);
  const color = (percentile: number) => {
    let color = "oklch(63.7% 0.237 25.331)";
    if (percentile > 5) {
      color = "oklch(60.6% 0.25 292.717)";
    }
    if (percentile > 12.5) {
      color = "oklch(69.6% 0.17 162.48)";
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
  };
  return (
    <ResponsiveLine
      data={data}
      colors={[color(percentile)]}
      yScale={{
        type: "linear",
        min: "0",
        max: "3500",
      }}
      theme={{
        text: {
          fill: "white",
          fontFamily: "var(--font-texturia)",
        },
      }}
      gridYValues={[0, 500, 1000, 1500, 2000, 2500, 3000, 3500]}
      xScale={{
        type: "time",
        format: "%Y-%m-%d",
        precision: "day",
      }}
      axisLeft={{
        tickValues: [0, 500, 1000, 1500, 2000, 2500, 3000, 3500],
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "Rating",
        legendOffset: -50,
        legendPosition: "middle",
        truncateTickAt: 0,
      }}
      enableArea={true}
      pointSize={5}
      margin={{ top: 10, right: 10, bottom: 50, left: 60 }}
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
        <div className="bg-darkwave-50/80 w-96 justify-center align-middle flex text-center rounded-md p-2 text-white">
          {point.data.name}
        </div>
      )}
    />
  );
}
