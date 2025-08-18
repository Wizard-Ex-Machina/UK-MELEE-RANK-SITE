"use-client";

import { TabProvider, Tab, TabList, TabPanel } from "@ariakit/react";
import { useEffect, useState } from "react";
import Spinner from "../spinner";

export default function HistoryTabs({
  id,
  bgColor,
}: {
  id: string;
  bgColor: string;
}) {
  const [matches, setMatches] = useState([]);
  const [placements, setPlacements] = useState([]);

  useEffect(() => {
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/player/matches?player=${id}`,
    ).then((data) => {
      data.json().then((json) => {
        setMatches(json);
      });
    });
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/player/placements?player=${id}`,
    ).then((data) => {
      data.json().then((json) => {
        setPlacements(json);
      });
    });
  }, [id]);

  return (
    <div className="w-full h-96 flex p-2 flex-col rounded-md bg-darkwave-100/60 text-white">
      <TabProvider>
        <TabList className="min-h-11 w-full gap-1 rounded-md p-2 bg-darkwave-100/80 flex justify-between">
          <Tab className="tab">Matches</Tab>
          <Tab className="tab">Placements</Tab>
          <Tab className="tab">Opponents</Tab>
        </TabList>

        <TabPanel className="h-full p-1 pb-2 rounded-md overflow-y-scroll">
          <MatchesTab matches={matches} />
        </TabPanel>

        <TabPanel className="h-full p-1 pb-2 rounded-md overflow-y-scroll">
          <PlacementsTab placements={placements} bgColor={bgColor} />
        </TabPanel>

        <TabPanel className="h-full p-1 pb-2 rounded-md overflow-y-scroll">
          opponents not implemented
        </TabPanel>
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

function PlacementsTab({
  placements,
  bgColor,
}: {
  placements: any[];
  bgColor: string;
}) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (placements.length > 0) setLoading(false);
  }, [placements]);

  return loading == true ? (
    <Spinner />
  ) : (
    <div className="grid grid-cols-1 gap-1 w-full">
      {placements.map((placement, index) => {
        if (index == 0) console.log(placement);
        return (
          <div
            key={placement.placementId}
            className={`p-1 grid grid-cols-4 rounded-md ${bgColor} w-full items-center`}
          >
            <div className="col-span-3 w-full text-ellipsis text-left">
              {placement.tournament}
            </div>

            <div className="col-span-1 text-right">
              {ordinal(placement.placement)}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function OpponentsTab({ opponents }: { opponents: any[] }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (opponents.length > 0) setLoading(false);
  }, [opponents]);

  return loading == true ? (
    <Spinner />
  ) : (
    <div className="grid grid-cols-1 gap-1">
      {opponents.map((opponent, index) => {
        if (index == 0) console.log(opponent);
        return (
          <div
            key={opponent.opponentId}
            className={`p-1 grid grid-cols-7 items-center rounded-md ${opponent.win ? "bg-green-500/25" : "bg-red-500/25"} w-full`}
          >
            <div className="col-span-3 w-full">{opponent.opponentName}</div>

            <div className="col-span-3 text-center">{`${opponent.score}:${opponent.opponentScore}`}</div>

            <div className="col-span-1 text-right">
              {`${opponent.delta > 0 ? "↑" : "↓"}${Math.abs(Math.floor(opponent.delta))}`}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ordinal(n: number) {
  switch (n % 100) {
    case 11:
      return "11th";
    case 12:
      return "12th";
    case 13:
      return "13th";
    default:
      switch (n % 10) {
        case 1:
          return `${n}st`;
        case 2:
          return `${n}nd`;
        case 3:
          return `${n}rd`;
        default:
          return `${n}th`;
      }
  }
}
