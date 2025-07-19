"use server";

import posthog from "posthog-js";
import Titlebar from "./_components/title-bar";
import LeaderboardItem from "./_components/leaderboard-item";
import { getLeaderboard } from "@util";

export default async function Home() {
  const date = new Date("2019-04-07");
  const oldDate = new Date(date);
  oldDate.setMonth(date.getMonth() - 1);

  const leaderboard = await getLeaderboard(date);
  const oldLeaderboard = await getLeaderboard(oldDate);

  posthog.capture("my event", { property: "value" });
  return (
    <>
      <Titlebar pageTitle="Glicko 2 leaderboard of melee players" />
      <div className="justify-center flex w-full overflow-clip max-w-screen p-4">
        <div className="md:w-full 3xl:w-5/9 grid grid-cols-1 gap-y-4">
          {leaderboard.map((player: { id; name; r; rd }, index: number) => {
            return (
              <LeaderboardItem
                percentile={(index / leaderboard.length) * 100}
                key={`player=${index}`}
                id={player.id}
                rank={index + 1}
                name={player.name}
                r={player.r}
                rd={player.rd}
                rDelta={
                  player.r -
                  oldLeaderboard.find(
                    (oldPlayer: { id; name; r; rd }) =>
                      oldPlayer.id === player.id,
                  )?.r
                }
                rankDelta={
                  index -
                  oldLeaderboard.findIndex(
                    (oldPlayer: { id; name; r; rd }) =>
                      oldPlayer.id === player.id,
                  )
                }
              />
            );
          })}
        </div>
      </div>
    </>
  );
}
