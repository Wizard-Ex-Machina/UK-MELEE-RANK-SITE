import Image from "next/image";
import posthog from "posthog-js";
import Titlebar from "./_components/Titlebar";
import LeaderboardItem from "./_components/LeaderboardItem";

export default async function Home() {
  const data = await fetch(
    "http://localhost:3000/api/leaderboard?date=2018-06-01",
  );
  const leaderboard = await data.json();

  posthog.capture("my event", { property: "value" });
  return (
    <>
      <Titlebar pageTitle="Glicko 2 leaderboard of melee players" />
      <div className="justify-center flex w-full overflow-clip max-w-screen p-4">
        <div className="xl:w-3/5 grid grid-cols-1 gap-y-4">
          {leaderboard.map(
            (
              player: { id: string; name: string; r: number; rd: number },
              index: number,
            ) => {
              return (
                <LeaderboardItem
                  percentile={(index / leaderboard.length) * 100}
                  key={`player=${index}`}
                  id={player.id}
                  rank={index + 1}
                  name={player.name}
                  r={player.r}
                  rd={player.rd}
                />
              );
            },
          )}
        </div>
      </div>
    </>
  );
}
