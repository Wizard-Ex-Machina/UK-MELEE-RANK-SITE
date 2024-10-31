import { Player } from "../page";

type props = {
  player: Player;
};

export default function LeaderboardItem(props: props) {
  const { player } = props;
  let color =
    "bg-gradient-to-r from-indigo-600/25 to-indigo-800/25 border-indigo-500 ";
  const { PlayerID, Name, Rank, RankDiff, Rd, Delta, R, Percentile } = player;
  if (Percentile > 5) {
    color = "bg-gradient-to-r from-red-600/25 to-red-800/25 border-red-500";
  }
  if (Percentile > 15) {
    color =
      "bg-gradient-to-r from-emerald-600/25 to-emerald-800/25 border-emerald-500 ";
  }
  if (Percentile > 25) {
    color =
      "bg-gradient-to-r from-yellow-600/25 to-yellow-800/25 border-yellow-500 ";
  }
  if (Percentile > 50) {
    color =
      "bg-gradient-to-r from-slate-600/25 to-slate-800/25 border-slate-500 ";
  }
  if (Percentile > 75) {
    color =
      "bg-gradient-to-r from-orange-700/25 to-orange-900/25 border-orange-600 ";
  }
  let rankDiff = "~";
  let rankDiffColor = "";
  if (RankDiff > 0) {
    rankDiff = "↑" + RankDiff;
    rankDiffColor = "text-green-500";
  }
  if (RankDiff < 0) {
    rankDiff = "↓" + Math.abs(RankDiff);
    rankDiffColor = "text-red-500";
  }
  let ratingDiff = "~";
  let ratingDiffColor = "";
  if (Delta > 0) {
    ratingDiff = "↑" + Math.round(Delta);
    ratingDiffColor = "text-green-500";
  }
  if (Delta < 0) {
    ratingDiff = "↓" + Math.abs(Math.round(Delta));
    ratingDiffColor = "text-red-500";
  }
  return (
    <div
      className={`my-4  w-full  border-2 rounded-md font-bold  ${color}`}
      key={PlayerID}
    >
      <div className="h-12 flex items-center px-4">
        <div className="w-16 items-center">
          <p className="text-center">#{Rank}</p>
        </div>
        <div className={`w-16 items-center ${rankDiffColor}`}>
          <p className="text-center">{rankDiff}</p>
        </div>
        <div className="w-full px-1 items-center">
          <p className="text-left">{Name}</p>
        </div>
        <div className="w-16 items-center">
          <p className="text-center">{Math.round(Rd)}</p>
        </div>
        <div className="w-16 items-center">
          <p className={`text-center ${ratingDiffColor}`}>{ratingDiff}</p>
        </div>
        <div className="w-24 items-center">
          <p className="text-center">{Math.round(R)}</p>
        </div>
      </div>
    </div>
  );
}
