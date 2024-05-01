import Bottleneck from "bottleneck";
import { log } from "console";
import { headers } from "next/headers";
import { env } from "~/env";
import { createMatch } from "~/server/queries/createMatch";
import { createPlayer } from "~/server/queries/createPlayer";
import { getEvents } from "~/server/queries/getEvents";
import { getMatchesInEvent } from "~/server/queries/getMatchesInEvent";

export async function GET(request: Request) {
  if (headers().get("Authorization") !== process.env.SECRET_KEY)
    return Response.json({ message: "Unauthorized" });
  const data = await matchesFromEvents();
  return Response.json({ data });
}
export const dynamic = "force-dynamic";

export async function matchesFromEvents() {
  const events = await getEvents();
  // Loop through each event
  for (const event of events) {
    if ((await getMatchesInEvent(event.melee_id)).length === 0) {
      log(`Processing event ${event.name}`);
      const newSets = await getSets(event.melee_id);
      // Process each set in the event
      for (const set of newSets.sort((a, b) => a.id - b.id)) {
        const matchesPromises = await set.players.map(
          async (playerResult: any) => {
            const player = await createPlayer({
              name: playerResult.entrant.split("| ").slice(-1)[0],
              start_gg_id: playerResult.startGGID,
              first_appears: event.end_at,
            });

            return player[0].id; // Just return the player object, no need for await here
          },
        );

        // Wait for all promises in the current set to resolve
        const matches = await Promise.all(matchesPromises);
        createMatch({
          event_id: event.melee_id,
          start_gg_id: event.melee_id + ":" + set.id,
          player_1_id: matches[0],
          player_2_id: matches[1],
          player_1_score: set.players[0].score,
          player_2_score: set.players[1].score,
        });
      }
    }
  }
  return { message: "done" };
}

async function getSetsPage(
  eventId: number,
  page: number,
  retry = 0,
): Promise<any> {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.STARTGG_API_TOKEN}`,
    },
    body: JSON.stringify({
      query: ` {
      event(id: ${eventId}) {
        sets(page: ${page}, perPage: 54 sortType: STANDARD) {
          nodes {
          id
            slots {
              entrant {
              participants {
                user {
                    id
                  }
                }
                name
              }
              standing {
                stats {
                  score {
                    value
                  }
                }
              }
            }
          }
        }
      }
    }`,
    }),
  };

  const responseRaw = await fetch("https://api.start.gg/gql/alpha", options);
  const response: any = await responseRaw.json();
  if (!response?.data?.event) {
    log(`Error fetching sets retrying ${retry} event ${eventId} page ${page}`);
    log(response);
    if (retry > 5) {
      log("Failed after 5 retries skipping page");
      return;
    }
    return setTimeout(() => {
      return getSetsPage(eventId, page, retry + 1);
    }, 5000);
  }
  try {
    const temp = response.data.event?.sets?.nodes
      .filter((slot: any) => {
        if (
          slot?.slots[0]?.standing?.stats?.score?.value === null ||
          slot?.slots[1]?.standing?.stats?.score?.value === null ||
          slot?.slots[0]?.standing === null ||
          slot?.slots[1]?.standing === null ||
          slot?.slots[0]?.entrant.name === null ||
          slot?.slots[1]?.entrant.name === null ||
          slot?.slots[0]?.entrant === null ||
          slot?.slots[1]?.entrant === null ||
          slot?.slots[0]?.entrant.participants[0].user === null ||
          slot?.slots[1]?.entrant.participants[0].user === null
        ) {
          return false;
        }
        return true;
      })
      .map((set: any) => {
        try {
          return {
            id: set.id,
            players: set.slots.map((slot: any) => {
              return {
                startGGID: slot.entrant.participants[0]?.user?.id,
                entrant: slot.entrant.name.split("| ").slice(-1)[0],
                score: slot?.standing?.stats?.score?.value,
              };
            }),
          };
        } catch (error) {
          log("Error in set", error);
        }
      });
    return temp;
  } catch (error) {
    console.log("Error fetching sets", error);
  }
}

const limiter = new Bottleneck({
  minTime: 1000,
});

async function getSets(eventId: number) {
  let page = 0;
  let sets: any[] = [];

  while (true) {
    try {
      const newSets = await limiter.schedule(
        async () => await getSetsPage(eventId, page),
      );
      if (newSets.length === 0) {
        return sets;
      }
      sets = sets.concat(newSets);
      page += 1;
    } catch (error) {
      console.error("Error fetching sets", error);
      break; // Decide if you want to retry, or handle errors differently
    }
  }
  return sets;
}
