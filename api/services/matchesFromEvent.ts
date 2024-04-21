import { getEvents } from "../controllers/postgresSQL/Events/getEvents";
import { getSets } from "../controllers/start gg/getSets";
import { getPlayer } from "../controllers/postgresSQL/players/getPlayerByStartGGID";
import { log } from "console";
import { createPlayer } from "../controllers/postgresSQL/players/createPlayer";
import { createMatch } from "../controllers/postgresSQL/sets/createSet";

export async function matchesFromEvents() {
  const events = await getEvents();
  // Loop through each event
  for (const event of events) {
    log(`Processing event ${event.name}`);
    const newSets = await getSets(event.melee_id);
    // Process each set in the event
    for (const set of newSets.sort((a, b) => a.id - b.id)) {
      const matchesPromises = set.players.map(async (playerResult: any) => {
        const player = await createPlayer(
          playerResult.entrant.split("| ").slice(-1)[0],
          playerResult.startGGID,
          event.end_at,
        );
        player.start_gg_id ? {} : log(player, playerResult);
        return player.id; // Just return the player object, no need for await here
      });

      // Wait for all promises in the current set to resolve
      const matches = await Promise.all(matchesPromises);
      createMatch({
        eventID: event.melee_id,
        startGGID: event.melee_id + ":" + set.id,
        player1ID: matches[0],
        player2ID: matches[1],
        player1Score: set.players[0].score,
        player2Score: set.players[1].score,
      });
    }
  }
}
