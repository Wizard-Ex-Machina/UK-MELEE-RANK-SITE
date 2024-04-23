type RatingRowProps = {
  rank: number;
  name: string;
  rating: number;
  rankChange: number;
  change: number;
  rd: number;
};
export function RatingRow(props: RatingRowProps) {
  let changeColor = "text-white",
    changeSign = "~",
    rankChangeColor = "text-white",
    rankChangeSign = "~";
  if (props.change > 0) {
    changeColor = "text-green-500";
    changeSign = "↑";
  } else if (props.change < 0) {
    changeColor = "text-red-500";
    changeSign = "↓";
  }
  if (props.rankChange > 0) {
    rankChangeColor = "text-green-500";
    rankChangeSign = "↑";
  } else if (props.rankChange < 0) {
    rankChangeColor = "text-red-500";
    rankChangeSign = "↓";
  }
  const colors = ["bg-zinc-700", "bg-zinc-600"];
  return (
    <div className={"h8 flex w-full rounded-md p-1 " + colors[props.rank % 2]}>
      <div className="w-16 items-center">
        <p className="text-center">{props.rank}</p>
      </div>
      <div className="w-16 items-center">
        <p className={"text-center " + rankChangeColor}>
          {rankChangeSign + Math.abs(props.rankChange)}
        </p>
      </div>
      <div className="w-full items-center px-1">
        <p className="text-left">{props.name}</p>
      </div>
      <div className="w-32 items-center px-1">
        <p className="text-center">{props.rating}</p>
      </div>
      <div className="w-32 items-center px-1 ">
        <p className={"text-center " + changeColor}>
          {changeSign + Math.abs(props.change)}
        </p>
      </div>
      <div className="w-32 items-center  px-1">
        <p className="text-center">{props.rd}</p>
      </div>
    </div>
  );
}
