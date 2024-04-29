import { log } from "console";
import { Glicko2 } from "glicko2.ts";

import { getplayersWithRatings } from "~/server/queries/GetMostRecentRatings";
import { getMatchesInPeriod } from "~/server/queries/getMatchesInPeriod";

import { createPlayerRating } from "~/server/queries/createPlayerRating";
import { getLatestRating } from "~/server/queries/getLatestPeriod";
export async function GET(request: Request) {
  await main();
  return Response.json({ message: "done" });
}

async function createRatingsForPeriod(period: { start: string; end: string }) {
  log(`Creating ratings for period ${period.start} to ${period.end}`);
  const ranking = new Glicko2();
  const players: any[] = await getplayersWithRatings({
    date: period.end,
  });

  const newMatches = await getMatchesInPeriod({
    start: new Date(period.start),
    end: new Date(period.end),
  });

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
      return;
    }
    if (!playerRatings.find((player) => player.id === match.player_2_id)) {
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

async function main() {
  const latest = await getLatestRating();
  let startDate = new Date("2016-01-01");

  if (latest.length > 0) {
    startDate = new Date(lastest[0].period);
  }

  const finalDate = new Date();

  while (addMonth(startDate) < finalDate) {
    const endDate = addMonth(startDate);

    await createRatingsForPeriod({
      start: startDate.toDateString(),
      end: endDate.toDateString(),
    });
    startDate = addMonth(startDate);
  }
}

function addMonth(date: Date): Date {
  let result = new Date(date);
  result.setMonth(date.getMonth() + 1);
  return result;
}
