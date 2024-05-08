"use client";
import { Chart as ReactChart } from "react-chartjs-2";
import { Chart as ChartJS, registerables } from "chart.js"; // Import registerables from "chart.js"

ChartJS.register(...registerables); // Register all elements and controllers
type Props = {
  data: any;
  options: any;
  plugins: any;
};
const value = 760;

export default function LineGraph(props: any) {
  return (
    <div className="mb-8 flex h-full w-full justify-center rounded-md bg-zinc-200 p-2">
      <ReactChart
        type={"line"}
        data={props.data}
        options={props.options}
        plugins={props.plugins}
      />
    </div>
  );
}
