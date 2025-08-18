"use client";

import * as AriaKit from "@ariakit/react";
import { useDisclosureStore } from "@ariakit/react";
import RatingHistoryChart from "./leaderboard-item/rating-history-chart";
import HistoryTabs from "./leaderboard-item/history-tabs";
import { useState } from "react";
import RatingCalendar from "./leaderboard-item/rating-calendar";

function colorFromPercentile(percentile: number) {
  if (percentile > 82.5)
    return "bg-gradient-to-r from-amber-700/50 to-orange-800/50";
  if (percentile > 65)
    return "bg-gradient-to-r from-gray-600/50 to-slate-800/50";
  if (percentile > 47.5)
    return "bg-gradient-to-r from-amber-500/50 to-orange-500/50";
  if (percentile > 30) return "bg-gradient-to-r from-sky-500/50 to-blue-500/50";
  if (percentile > 12.5)
    return "bg-gradient-to-r from-green-500/50 to-lime-500/50";
  if (percentile > 5)
    return "bg-gradient-to-r from-violet-600/50 to-purple-700/50";
  return "bg-gradient-to-r from-red-500/50 to-rose-500/50";
}

function colorFromPercentileFade(percentile: number) {
  if (percentile > 82.5)
    return "bg-gradient-to-r from-amber-700/10 to-orange-800/10";
  if (percentile > 65)
    return "bg-gradient-to-r from-gray-600/10 to-slate-800/10";
  if (percentile > 47.5)
    return "bg-gradient-to-r from-amber-500/10 to-orange-500/10";
  if (percentile > 30) return "bg-gradient-to-r from-sky-500/10 to-blue-500/10";
  if (percentile > 12.5)
    return "bg-gradient-to-r from-green-500/10 to-lime-500/10";
  if (percentile > 5)
    return "bg-gradient-to-r from-violet-600/10 to-purple-700/10";
  return "bg-gradient-to-r from-red-500/10 to-rose-500/10";
}

export default function LeaderboardItem({
  percentile,
  id,
  rank,
  name,
  r,
  rd,
  rankDelta,
  rDelta,
}: {
  percentile: number;
  id: string;
  rank: number;
  name: string;
  r: number;
  rd: number;
  rankDelta: number;
  rDelta: number;
}) {
  const [open, setOpen] = useState(false);
  const disclosureStore = useDisclosureStore({ open, setOpen });
  return (
    <div
      className={`min-w-full w-max-full transition-all duration-300 font-[family-name:var(--font-space-mono)] grid grid-cols-1 bg-darkwave-200"} rounded-md ${colorFromPercentileFade(percentile)} ${open && "3xl:-mx-32"} ${!open && "hover:3xl:-mx-8"}`}
    >
      <AriaKit.DisclosureProvider store={disclosureStore}>
        <AriaKit.Disclosure
          className={`w-full max-w-full min-h-12 h-12 max-h-24 flex col-span-3 items-center px-4 rounded-md font-bold hover:cursor-pointer ${colorFromPercentile(percentile)} text-white`}
        >
          <div className="w-16 items-center">
            <p className="text-center">#{rank}</p>
          </div>
          <div className={`w-16 items-center`}>
            <p className="text-center">{`${rankDelta == 0 ? "~" : `${rankDelta < 0 ? "↑" : "↓"}${Math.abs(rankDelta)}`}`}</p>
          </div>
          <div className="w-full px-1 items-center">
            <p className="text-left text-ellipsis">{name}</p>
          </div>
          <div className="w-16 items-center">
            <p className="text-center">{Math.round(rd)}</p>
          </div>
          <div className="w-16 items-center">
            <p
              className={`text-center`}
            >{`${rDelta == 0 ? "~" : `${rDelta > 0 ? "↑" : "↓"}${Math.abs(Math.floor(rDelta))}`}`}</p>
          </div>
          <div className="w-24 items-center">
            <p className="text-center">{Math.round(r)}</p>
          </div>
        </AriaKit.Disclosure>
        <AriaKit.DisclosureContent>
          <div
            className={`grid grid-cols-1 p-2 gap-2 w-full 3xl:grid-cols-3 transition-all duration-1000 delay-300 ${!open && "h-0"}`}
          >
            {open && (
              <>
                <div className="3xl:col-span-2 min-w-full h-96 p-2 bg-darkwave-100/60 rounded-md text-white font-[family-name:var(--font-texturina)]">
                  <RatingHistoryChart id={id} percentile={percentile} />
                </div>
                <HistoryTabs
                  id={id}
                  bgColor={colorFromPercentileFade(percentile)}
                />
                <RatingCalendar id={id} />
              </>
            )}
          </div>
        </AriaKit.DisclosureContent>
      </AriaKit.DisclosureProvider>
    </div>
  );
}
