"use-client";

import { TabProvider, Tab, TabList, TabPanel } from "@ariakit/react";
import { Span } from "next/dist/trace";
import { useEffect, useMemo, useState } from "react";
import Spinner from "../Spinner";
export default function HistoryTabs({ id }: { id: string }) {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/player/matches?player=${id}`,
    ).then((data) => {
      data.json().then((json) => {
        setMatches(json);
      });
    });
  }, [id]);

  return (
    <div className="w-full h-96 flex p-2 flex-col rounded-md bg-darkwave-100/60 text-white">
      <TabProvider>
        <TabList className="min-h-11 w-full gap-1 rounded-md p-1 bg-darkwave-100/80 flex justify-between">
          <Tab className="tab">Matches</Tab>
          <Tab className="tab">Placements</Tab>
          <Tab className="tab">Opponents</Tab>
        </TabList>

        <TabPanel className="h-full p-1 pb-2 rounded-md overflow-y-scroll">
          <MatchesTab matches={matches} />
        </TabPanel>
        <TabPanel>placements not Implemented</TabPanel>
        <TabPanel>opponents not Implemented</TabPanel>
      </TabProvider>
    </div>
  );
}

function MatchesTab({ matches }: { matches: any[] }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (matches.length > 0) setLoading(false);
  }, [matches]);

  return loading == true ? (
    <Spinner />
  ) : (
    <div className="grid grid-cols-1 gap-1">
      {matches.map((match, index) => {
        if (index == 0) console.log(match);
        return (
          <div
            key={match.matchId}
            className={`p-1 grid grid-cols-7 items-center rounded-md ${match.win ? "bg-green-500/25" : "bg-red-500/25"} w-full`}
          >
            <div className="col-span-3 w-full">{match.opponentName}</div>

            <div className="col-span-3 text-center">{`${match.score}:${match.opponentScore}`}</div>

            <div className="col-span-1 text-right">
              {`${match.delta > 0 ? "↑" : "↓"}${Math.abs(Math.floor(match.delta))}`}
            </div>
          </div>
        );
      })}
    </div>
  );
}
