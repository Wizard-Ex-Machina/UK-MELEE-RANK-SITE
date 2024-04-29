import { Suspense } from "react";
import TopPlayerGraph from "./TopPlayerGraph";
import { playersWithRanking } from "../../server/queries/playersWithRatings";

export default async function RatingGraph() {
  const players = (await playersWithRanking()).slice(0, 100);
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
    <Suspense>
      <TopPlayerGraph {...data} />
    </Suspense>
  );
}
