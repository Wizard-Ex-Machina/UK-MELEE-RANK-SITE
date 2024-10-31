import { playfair_dislpay, bebas_neue } from "./fonts";
import Titlebar from "./_components/Titlebar";
import { log } from "console";
import LeaderboardItem from "./_components/LeaderboardItem";

export const dynamic = "force-dynamic";
export default async function Home() {
  async function getLeaderboard(): Promise<Player[]> {
    const res = await fetch("http://localhost:8080/leaderboard", {
      next: {
        revalidate: 216000,
      },
    });
    const data = await res.json();

    return data;
  }

  const leaderboard = await getLeaderboard();

  return (
    <div>
      <Titlebar
        title="A Glicko2 Ranking Of People That Sometimes Play Melee In The UK"
        subtitle="Now with daily updates!"
      />
      <div className="w-full flex justify-center">
        <div className="w-1/2">
          <div
            className={`my-4 h-12 w-full flex  border-2 rounded-md font-bold px-4 items-center bg-gradient-to-r from-zinc-100/25 to-zinc-300/25 border-zinc-50`}
          >
            <div className="w-16 items-center">
              <p className="text-center">RANK</p>
            </div>
            <div className="w-16 items-center">
              <p className="text-center">↑↓</p>
            </div>
            <div className="w-full px-1 items-center">
              <p className="text-left">NAME</p>
            </div>
            <div className="w-16 items-center">
              <p className="text-center">RD</p>
            </div>
            <div className="w-16 items-center">
              <p className="text-center">↑↓</p>
            </div>
            <div className="w-24 items-center">
              <p className="text-center">RATING</p>
            </div>
          </div>
          {leaderboard.map((player: Player) => {
            return <LeaderboardItem player={player} />;
          })}
        </div>
      </div>
    </div>
  );
}

export type Player = {
  Name: string;
  PlayerID: number;
  Rank: number;
  RankDiff: number;
  R: number;
  Rd: number;
  Delta: number;
  Percentile: number;
};
