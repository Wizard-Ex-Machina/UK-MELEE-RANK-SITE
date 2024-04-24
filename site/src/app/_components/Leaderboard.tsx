import { RatingTitle } from "./RatingTitle";
import { RatingRow } from "./RatingRow";
import {
  getLeaderBoard,
  PlayerForLeaderboard,
} from "~/server/queries/leaderboard";

export default async function Leaderboard() {
  let players: PlayerForLeaderboard[] = await getLeaderBoard();
  const oldOrder = players.slice(0).sort((a, b) => {
    return b.last_rating - a.last_rating;
  });
  players = players.map((player, index) => {
    const oldIndex = oldOrder.findIndex(
      (oldPlayer) => oldPlayer.id === player.id,
    );
    return {
      ...player,
      rankChange: oldIndex - index,
    };
  });
  return (
    <>
      <RatingTitle />
      {players.map((player: PlayerForLeaderboard, index: number) => {
        return (
          <RatingRow
            key={player.id}
            rank={index + 1}
            rankChange={player.rankChange ?? 0}
            name={player.name}
            rating={Math.round(player.rating)}
            rd={Math.round(player.rd)}
            change={Math.round(player.rating_change)}
          />
        );
      })}
    </>
  );
}
