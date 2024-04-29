import { RatingTitle } from "./RatingTitle";
import { RatingRow } from "./RatingRow";
import {
  getLeaderBoard,
  PlayerForLeaderboard,
} from "~/server/queries/leaderboard";
import { getMatchesForId } from "~/server/queries/getMatchesForID";
import { getRatingsForId } from "~/server/queries/getRatingsForID";
import { PlayerProfile } from "./PlayerProfile/PlayerProfile";

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
  let toggle = false;
  function setToggle() {
    toggle = !toggle;
  }
  return (
    <>
      <RatingTitle />
      {players.map(async (player: PlayerForLeaderboard, index: number) => {
        return (
          <>
            <RatingRow
              key={player.id}
              rank={index + 1}
              player={player}
              players={players}
            />
          </>
        );
      })}
    </>
  );
}
