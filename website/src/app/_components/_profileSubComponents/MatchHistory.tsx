"use client";
import { Player } from "../../page";
import { useEffect, useState } from "react";
type PlayerProfileProps = {
  player: Player;
};
function getColor(win: boolean) {
  if (win) return "bg-green-500/25 border-green-500";
  if (!win) return "bg-rose-700/25 border-rose-700";
}

type Match = {
  MatchID: number;
  PlayerID: number;
  OpponentID: number;
  OpponentName: string;
  PlayerScore: number;
  OpponentScore: number;
  RatingChange: number;
  PlayerWin: boolean;
};
export default function RecentMatches(props: PlayerProfileProps) {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    fetch(`https://meleeranked.uk/api/matchHistory/${props.player.PlayerID}`)
      .then((res) => res.json())
      .then((data) => {
        setMatches(data);
        setLoading(false);
      });
  }, [props.player.PlayerID]);
  return (
    <div className="flex flex-col ">
      <div className="text-lg font-bold">Recent Matches</div>
      <div className="h-36 overflow-y-scroll">
        {loading ? (
          <div>Loading...</div>
        ) : (
          matches.map((match: Match) => (
            <div
              key={match.MatchID}
              className={`grid grid-cols-5 gap-1 w-full my-1 p-1 rounded-md border-2 ${getColor(
                match.PlayerWin,
              )}`}
            >
              <div className="col-span-3">{match.OpponentName}</div>
              <div className="text-center">
                {match.PlayerScore}:{match.OpponentScore}
              </div>
              <div className="text-end">
                {match.PlayerWin ? "↑" : "↓"}
                {Math.abs(Math.round(match.RatingChange))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
