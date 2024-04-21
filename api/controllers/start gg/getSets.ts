import Bottleneck from "bottleneck";
import { log } from "console";
import { STARTGG_API_TOKEN } from "../../config";

async function getSetsPage(eventId: number, page: number, retry: number = 0) {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${STARTGG_API_TOKEN}`,
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

export async function getSets(eventId: number) {
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
