import { PlayerForLeaderboard } from "~/server/queries/leaderboard";
import LineGraph from "./Chart";
import { playersWithRanking } from "~/server/queries/playersWithRatings";

type Props = {
  rating: number;
  players: PlayerForLeaderboard[];
};

export default async function DistGraph(props: Props) {
  const { players } = props;
  const plugins = [
    {
      afterDraw: function (chart) {
        const ctx = chart.ctx;
        const xAxis = chart.scales["x"];

        // Draw vertical line at x-axis value 4
        const xValue = xAxis.getPixelForDecimal(props.rating / 1560 - 21 / 52);
        ctx.save();
        ctx.strokeStyle = "rgb(255, 99, 132)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(xValue, chart.chartArea.top); // Start the line at the top of the chart area
        ctx.lineTo(xValue, chart.chartArea.bottom); // Draw the line to the bottom of the chart area
        ctx.stroke();
        ctx.restore();
      },
    },
  ];

  const data = {
    labels: Array.from({ length: 13 }).map((_, i) => 500 + (i + 1) * 130),
    datasets: [
      {
        type: "line",
        label: "Player Distribution",
        data: Array.from({ length: 13 }).map(
          (_, i) =>
            players.filter((player: PlayerForLeaderboard) => {
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
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Player Distribution",
      },
    },
  };

  return <LineGraph data={data} options={options} plugins={plugins} />;
}
