"use client";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { playersWithRanking } from "~/server/queries/playersWithRatings";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);
export default async function TopPlayerGraph(props: any) {
  const options = {
    scales: {
      x: {
        stacked: true,
      },
      y: {
        // This assumes a vertical bar chart (y-axis as the scale for values)
        beginAtZero: false, // Explicitly telling Chart.js not to start at zero
        // min: 100, // Setting the minimum value of the y-axis
        // You can also set 'max' if you need to cap the y-axis
      },
    },
  };
  return (
    <div className="mb-8 flex h-full w-full justify-center rounded-md bg-zinc-200 p-2">
      <Bar data={props} options={options} />
    </div>
  );
}
