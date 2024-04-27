"use client";
import { Suspense, useState } from "react";
import { PlayerForLeaderboard } from "~/server/queries/leaderboard";
import { PlayerProfile } from "./PlayerProfile/PlayerProfile";

type RatingRowProps = {
  player: PlayerForLeaderboard;
  players: PlayerForLeaderboard[];
  rank: number;
};
export function RatingRow(props: RatingRowProps) {
  const [toggled, setToggled] = useState(false);
  const { name, rankChange, rating, rating_change, rd } = props.player;
  let changeColor = "text-white",
    changeSign = "~",
    rankChangeColor = "text-white",
    rankChangeSign = "~";
  if (rating_change > 0) {
    changeColor = "text-green-500";
    changeSign = "↑";
  } else if (rating_change < 0) {
    changeColor = "text-red-500";
    changeSign = "↓";
  }
  if ((rankChange ?? 0) > 0) {
    rankChangeColor = "text-green-500";
    rankChangeSign = "↑";
  } else if ((rankChange ?? 0) < 0) {
    rankChangeColor = "text-red-500";
    rankChangeSign = "↓";
  }
  const colors = ["bg-zinc-700", "bg-zinc-600"];
  return (
    <div onClick={() => setToggled(!toggled)} className="cursor-pointer">
      <div
        className={"h8 flex w-full rounded-md p-1 " + colors[props.rank % 2]}
      >
        <div className="w-16 items-center">
          <p className="text-center">{props.rank}</p>
        </div>
        <div className="w-16 items-center">
          <p className={"text-center " + rankChangeColor}>
            {rankChangeSign + Math.abs(rankChange ?? 0)}
          </p>
        </div>
        <div className="w-full items-center px-1">
          <p className="text-left">{name}</p>
        </div>
        <div className="w-32 items-center px-1">
          <p className="text-center">{Math.round(rating)}</p>
        </div>
        <div className="w-32 items-center px-1 ">
          <p className={"text-center " + changeColor}>
            {changeSign + Math.abs(Math.round(rating_change))}
          </p>
        </div>
        <div className="w-32 items-center  px-1">
          <p className="text-center">{props.rd}</p>
        </div>
      </div>
      {toggled ? (
        <Suspense>
          <PlayerProfile player={props.player} players={props.players} />
        </Suspense>
      ) : null}
    </div>
  );
}
