"use client";
import { ResponsiveCalendar } from "@nivo/calendar";
import { useEffect, useState } from "react";

export default function RatingCalendar({ id }: { id: string }) {
  const [chartData, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  function calcDiff(index: number, value: number, array: any[]) {
    if (index === 0) return value - 2500;
    return value - array[index - 1].r;
  }

  useEffect(() => {
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/player/rating-history?player=${id}`,
    ).then((data) => {
      data.json().then((data) => {
        setData(
          data
            .sort((a: any, b: any) => {
              return a.endAt < b.endAt ? -1 : 1;
            })
            .map((h: any, index: number) => ({
              day: h.endAt,
              value: calcDiff(index, h.r, data),
              name: h.tournament,
            }))
            .sort((a: any, b: any) => {
              return a.day > b.day ? -1 : 1;
            }),
        );
        setLoading(false);
      });
    });
  }, [id]);

  return (
    <div className="bg-darkwave-100/60 w-full md:h-40 lg:h-48 overflow-y-scroll p-2 rounded-md hidden md:block 3xl:col-span-3 h-30 text-white font-[family-name:var(--font-texturina)]">
      <ResponsiveCalendar
        from={"2018-01-01"}
        colors={["#ef444440", "#22c55e40"]}
        theme={{
          text: {
            fill: "white",
            fontFamily: "var(--font-texturia)",
          },
        }}
        align="top"
        yearSpacing={40}
        minValue={-100}
        maxValue={100}
        emptyColor="#5a5a6140"
        to={"2018-12-31"}
        daySpacing={4}
        dayBorderWidth={0}
        monthBorderWidth={0}
        data={chartData}
        margin={{ top: 20, right: 8, bottom: 8, left: 40 }}
        tooltip={(point) => {
          return (
            // @ts-ignore
            <div className="bg-darkwave-50/80 w-48 float p-2 text-center rounded-md">{`${point.data.name} – ${+point.value > 0 ? "↑" : "↓"} ${Math.abs(Math.floor(+point.value))}`}</div>
          );
        }}
      />
    </div>
  );
}
