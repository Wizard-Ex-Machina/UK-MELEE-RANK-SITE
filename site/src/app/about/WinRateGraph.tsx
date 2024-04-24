import glicko2 from "glicko2";
import LineGraph from "./LineGraph";

export default function WinRateGraph() {
  const ranking = new glicko2.Glicko2();
  const player = ranking.makePlayer(1335, 30, 0.06);
  const opponents = Array.from({ length: 45 }).map((item, index) => {
    return ranking.makePlayer((index + 1) * 50, 100, 0.06);
  });
  const data = {
    labels: opponents.map((_item, index) => index * 50),
    datasets: [
      {
        label: "Expected Win Rate",
        data: opponents.map((opponent) => {
          return ranking.predict(player, opponent) * 100;
        }),
        pointStyle: false,
        pointHoverRadius: 15,
        fill: true,
        backgroundColor: "#4ade80",
        borderColor: "#4ade80",
        tension: 0.1,
      },
    ],
  };
  return <LineGraph data={data} />;
}
