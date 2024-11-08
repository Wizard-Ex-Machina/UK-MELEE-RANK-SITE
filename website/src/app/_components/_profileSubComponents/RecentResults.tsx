"use client";
import { Player } from "../../page";
import { useEffect, useState } from "react";
type PlayerProfileProps = {
  player: Player;
};

type Result = {
  PlayerID: number;
  TournamentID: number;
  Placement: number;
  TouranmentName: string;
  TotalPlayers: number;
};

const intToOrdinalNumberString = (num: number): string => {
  num = Math.round(num);
  let numString = num.toString();

  // If the ten's place is 1, the suffix is always "th"
  // (10th, 11th, 12th, 13th, 14th, 111th, 112th, etc.)
  if (Math.floor(num / 10) % 10 === 1) {
    return numString + "th";
  }

  // Otherwise, the suffix depends on the one's place as follows
  // (1st, 2nd, 3rd, 4th, 21st, 22nd, etc.)
  switch (num % 10) {
    case 1:
      return numString + "st";
    case 2:
      return numString + "nd";
    case 3:
      return numString + "rd";
    default:
      return numString + "th";
  }
};

export default function RecentResults(props: PlayerProfileProps) {
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    fetch(`https://meleeranked.uk/api/recentResults/${props.player.PlayerID}`)
      .then((res) => res.json())
      .then((data) => {
        setResults(data);
        setLoading(false);
      });
  }, [props.player.PlayerID]);
  return (
    <div className="flex flex-col ">
      <div className="text-lg font-bold">Recent Results</div>
      <div className="h-36 overflow-y-scroll">
        {loading ? (
          <div>Loading...</div>
        ) : (
          results.map((result: Result) => (
            <div
              key={result.TournamentID}
              className={`grid grid-cols-6 gap-1 w-full my-1 p-1 rounded-md border-2 border-gray-500 bg-gray-500/25`}
            >
              <div className="col-span-4 truncate">{result.TouranmentName}</div>
              <div className="col-span-2 text-end">
                {intToOrdinalNumberString(result.Placement)}/
                {result.TotalPlayers}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
