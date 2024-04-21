import { log } from "console";
import { Glicko2 } from "glicko2.ts";

import { getMatchesInPeriod } from "../../controllers/postgresSQL/sets/getMatchesInPeriod";
import { createPlayerRating } from "../../controllers/postgresSQL/PlayerRatings/createPlayerRating";
import { getplayersWithRatings } from "../../controllers/postgresSQL/PlayerRatings/getMostRecentRating";

export async function createRatingsForPeriod(period: {
  start: string;
  end: string;
}) {
  const ranking = new Glicko2();
  const players: any[] = await getplayersWithRatings(period.end);
  const newMatches = await getMatchesInPeriod(period.start, period.end);
  const playerRatings = players.map((player) => {
    if (player.rating === null) {
      let newPlayer = {
        ...player,
        glicko: ranking.makePlayer(1500, 350, 0.06),
      };
      return newPlayer;
    } else {
      let newPlayer = {
        ...player,
        glicko: ranking.makePlayer(player.rating, player.rd, player.vol),
      };
      return newPlayer;
    }
  });
  const games = [];

  newMatches.map((match) => {
    if (!playerRatings.find((player) => player.id === match.player_1_id)) {
      log(`Player ${match.player_1_id} not found in playerRatings`);
      return;
    }
    if (!playerRatings.find((player) => player.id === match.player_2_id)) {
      log(`Player ${match.player_2_id} not found in playerRatings`);
      return;
    }

    if (match.player_1_score === -1 || match.player_2_score === -1) return;
    for (let i = 1; i <= match.player_1_score; i++) {
      games.push([
        playerRatings.find((player) => player.id === match.player_1_id).glicko,
        playerRatings.find((player) => player.id === match.player_2_id).glicko,
        1,
      ]);
    }
    for (let i = 1; i <= match.player_2_score; i++) {
      games.push([
        playerRatings.find((player) => player.id === match.player_2_id).glicko,
        playerRatings.find((player) => player.id === match.player_1_id).glicko,
        1,
      ]);
    }
  });
  ranking.updateRatings(games);
  log(
    `Rating period: ${period.start} to ${period.end} had ${games.length} games`,
  );
  // Wait for all player ratings to be created before continuing
  return await Promise.all(
    playerRatings.map(async (player) => {
      // if (player.id === 2067) {
      //   log(player);
      // }
      // log frenzy
      const rating = player.glicko.getRating(),
        rd = player.glicko.getRd(),
        vol = player.glicko.getVol();
      return await createPlayerRating({
        playerId: player.id,
        rating,
        rd,
        vol,
        period: period.end,
      });
    }),
  );
}
