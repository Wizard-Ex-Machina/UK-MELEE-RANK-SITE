"use client";
import { Suspense, useState } from "react";
import { Player } from "../page";
import PlayerProfile from "./PlayerProfile";

type props = {
  player: Player;
};

function getColor(percentile: number) {
  let color =
    "bg-gradient-to-r from-indigo-600/25 to-indigo-800/25 border-indigo-500 ";
  if (percentile > 5) {
    color = "bg-gradient-to-r from-red-600/25 to-red-800/25 border-red-500";
  }
  if (percentile > 12.5) {
    color =
      "bg-gradient-to-r from-emerald-600/25 to-emerald-800/25 border-emerald-500 ";
  }
  if (percentile > 25) {
    color =
      "bg-gradient-to-r from-yellow-600/25 to-yellow-800/25 border-yellow-500 ";
  }
  if (percentile > 50) {
    color =
      "bg-gradient-to-r from-slate-600/25 to-slate-800/25 border-slate-500 ";
  }
  if (percentile > 75) {
    color =
      "bg-gradient-to-r from-orange-700/25 to-orange-900/25 border-orange-600 ";
  }
  return color;
}

function getRankDiffColor(rankDiff: number) {
  let rankDiffColor = "",
    rankDiffText = "~";
  if (rankDiff > 0) {
    rankDiffColor = "text-green-500";
    rankDiffText = "↑" + rankDiff;
  }
  if (rankDiff < 0) {
    rankDiffColor = "text-red-500";
    rankDiffText = "↓" + Math.abs(rankDiff);
  }
  return { rankDiffColor, rankDiffText };
}

function getRatingDiffColor(ratingDiff: number) {
  let ratingDiffColor = "",
    ratingDiffText = "~";
  if (ratingDiff > 0) {
    ratingDiffColor = "text-green-500";
    ratingDiffText = "↑" + Math.round(ratingDiff);
  }
  if (ratingDiff < 0) {
    ratingDiffColor = "text-red-500";
    ratingDiffText = "↓" + Math.abs(Math.round(ratingDiff));
  }
  return { ratingDiffColor, ratingDiffText };
}

export default function LeaderboardItem(props: props) {
  const { player } = props;
  const { PlayerID, Name, Rank, RankDiff, Rd, Delta, R, Percentile } = player;

  const color = getColor(player.Percentile);
  const { rankDiffColor, rankDiffText } = getRankDiffColor(player.RankDiff);
  const { ratingDiffColor, ratingDiffText } = getRatingDiffColor(player.Delta);
  const [isActive, setIsActive] = useState(false);
  return (
    <div
      className={`my-4  w-full  border-2 rounded-md font-bold  ${color} hover:cursor-pointer `}
      key={PlayerID}
      onClick={() => setIsActive(!isActive)}
    >
      <div className="min-h-12 flex items-center px-4">
        <div className="w-16 items-center">
          <p className="text-center">#{Rank}</p>
        </div>
        <div className={`w-16 items-center ${rankDiffColor}`}>
          <p className="text-center">{rankDiffText}</p>
        </div>
        <div className="w-full px-1 items-center">
          <p className="text-left">{Name}</p>
        </div>
        <div className="w-16 items-center">
          <p className="text-center">{Math.round(Rd)}</p>
        </div>
        <div className="w-16 items-center">
          <p className={`text-center ${ratingDiffColor}`}>{ratingDiffText}</p>
        </div>
        <div className="w-24 items-center">
          <p className="text-center">{Math.round(R)}</p>
        </div>
      </div>
      {isActive ? (
        <Suspense className="flex items-center px-4 text-white">
          <PlayerProfile player={player} />
        </Suspense>
      ) : null}
    </div>
  );
}
