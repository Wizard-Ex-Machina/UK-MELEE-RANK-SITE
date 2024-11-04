"use client";
import { Player } from "../../page";
import { useEffect, useState } from "react";
type PlayerProfileProps = {
  player: Player;
};
function getColor(wins: number, loses: number) {
  if (wins > loses) return "bg-green-500/25 border-green-500";
  if (wins < loses) return "bg-rose-700/25 border-rose-700";
  if (wins === loses) return "bg-gray-500/25 border-gray-500";
}

type Opponent = {
  OpponentId: number;
  OpponentName: string;
  Wins: number;
  Losses: number;
  Rating: number;
};
export default function Opponents(props: PlayerProfileProps) {
  const [opponents, setOpponents] = useState<Opponent[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:8080/opponentRecords/${props.player.PlayerID}`)
      .then((res) => res.json())
      .then((data) => {
        setOpponents(data);
        setLoading(false);
      });
  }, [props.player.PlayerID]);
  return (
    <div className="flex flex-col ">
      <div className="text-lg font-bold">Player Matchups</div>
      <div className="h-36 overflow-y-scroll">
        {loading ? (
          <div>Loading...</div>
        ) : (
          opponents.map((opponent: Opponent) => (
            <div
              key={opponent.OpponentId}
              className={`flex items-center justify-between p-1 my-1 rounded-md border-2 ${getColor(
                opponent.Wins,
                opponent.Losses,
              )}`}
            >
              <div>{opponent.OpponentName}</div>
              <div>
                {opponent.Wins}:{opponent.Losses}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
