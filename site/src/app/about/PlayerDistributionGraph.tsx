import LineGraph from "./LineGraph";
import { playersWithRanking } from "~/server/queries/playersWithRatings";

export default async function PlayerDistributionGraph() {
  const players = await playersWithRanking();
  const data = {
    labels: Array.from({ length: 13 }).map((_, i) => 500 + (i + 1) * 130),
    datasets: [
      {
        label: "Player Distribution",
        data: Array.from({ length: 13 }).map(
          (_, i) =>
            players.filter((player) => {
              return (
                player.rating >= 500 + (i + 1) * 130 &&
                player.rating < 500 + (i + 2) * 130
              );
            }).length,
        ),
        pointStyle: false,
        pointHoverRadius: 15,
        fill: true,
        backgroundColor: "#4ade80",
        borderColor: "#4ade80",
        tension: 0.3,
      },
    ],
  };
  const options = {
    scales: {
      y: {
        min: 0,
        max: 40,
      },
    },
  };
  return <LineGraph data={data} options={options} />;
}
