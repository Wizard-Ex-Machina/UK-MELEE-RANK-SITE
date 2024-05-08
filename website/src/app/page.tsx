import { Suspense } from "react";
import Leaderboard from "./_components/Leaderboard";
import TopPlayerGraph from "./_components/TopPlayerGraph";
import { playersWithRanking } from "../server/queries/playersWithRatings";

export default async function HomePage() {
  const players = await playersWithRanking();
  const showTop = 500;
  const data = {
    labels: players
      .slice(0, showTop)
      .map((player, index) => index + 1 + " " + player.name),
    datasets: [
      {
        label: "66% Confidence",
        data: players.slice(0, showTop).map((player) => {
          return [
            Math.round(player.rating) - Math.round(player.rd),
            Math.round(player.rating) + Math.round(player.rd),
          ];
        }),
        backgroundColor: ["#4ade80"],
      },
      {
        label: "95% Confidence",
        data: players.slice(0, showTop).map((player) => {
          return [
            Math.round(player.rating) - Math.round(player.rd) * 2,
            Math.round(player.rating) + Math.round(player.rd) * 2,
          ];
        }),
        backgroundColor: ["#15803d"],
      },
    ],
  };
  return (
    <main className="flex min-h-screen flex-col items-center bg-zinc-900 p-8 text-white">
      <div className="w-full lg:px-96">
        <Suspense>
          <Leaderboard />
        </Suspense>
      </div>
    </main>
  );
}
