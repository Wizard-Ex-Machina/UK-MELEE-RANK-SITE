"use client";

function colorFromPercentile(percentile: number) {
  if (percentile > 82.5)
    return "bg-gradient-to-r from-amber-700/80 to-orange-800/80";
  if (percentile > 65)
    return "bg-gradient-to-r from-gray-600/80 to-slate-800/80";
  if (percentile > 47.5)
    return "bg-gradient-to-r from-amber-500/80 to-orange-500/80";
  if (percentile > 30) return "bg-gradient-to-r from-sky-500/80 to-blue-500/80";
  if (percentile > 12.5)
    return "bg-gradient-to-r from-green-500/80 to-lime-500/80";
  if (percentile > 5)
    return "bg-gradient-to-r from-violet-600/80 to-purple-700/80";
  return "bg-gradient-to-r from-red-500/80 to-rose-500/80";
}

export default function LeaderboardItem({
  percentile,
  id,
  rank,
  name,
  r,
  rd,
}: {
  percentile: number;
  id: string;
  rank: number;
  name: string;
  r: number;
  rd: number;
}) {
  return (
    <div
      className={`w-full max-w-full min-h-12 flex items-center px-4 rounded-md font-bold hover:cursor-pointer ${colorFromPercentile(percentile)} font-[family-name:var(--font-space-mono)] text-white`}
      // onClick={() => setIsActive(!isActive)}
    >
      <div className="w-16 items-center">
        <p className="text-center">#{rank}</p>
      </div>
      <div className={`w-16 items-center`}>
        <p className="text-center">{"~"}</p>
      </div>
      <div className="w-full px-1 items-center">
        <p className="text-left text-ellipsis">{name}</p>
      </div>
      <div className="w-16 items-center">
        <p className="text-center">{Math.round(rd)}</p>
      </div>
      <div className="w-16 items-center">
        <p className={`text-center`}>{"~"}</p>
      </div>
      <div className="w-24 items-center">
        <p className="text-center">{Math.round(r)}</p>
      </div>
    </div>
  );
}
