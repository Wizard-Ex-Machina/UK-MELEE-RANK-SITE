import { createEvent, Event } from "~/server/queries/createEvent";
import { headers } from "next/headers";
import { env } from "~/env";

export async function GET(request: Request) {
  if (headers().get("Authorization") !== process.env.SECRET_KEY)
    return Response.json({ message: "Unauthorized" });
  const data = await getEvents();
  return Response.json({ message: "done" });
}

export const dynamic = "force-dynamic";
async function getEventsPage(page: number) {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.STARTGG_API_TOKEN}`,
    },
    body: JSON.stringify({
      query: `{
        tournaments(
          query: {page: ${page}, perPage:  250, filter: {past: true, countryCode: "GB", videogameIds: [1]} }
        ) {
          nodes {
            id
            name
            events {
              name
              id
            }
            endAt
            postalCode
          }
        }
      }`,
    }),
  };

  //^(?!.*doubles).*melee.*

  const responseRaw = await fetch("https://api.start.gg/gql/alpha", options);
  const response: any = await responseRaw.json();
  try {
    response.data.tournaments.nodes.map(
      (tournament: any) =>
        !tournament.events.map((event: any) => {
          if (
            new RegExp("MELEE.*SINGLES").test(event.name.toUpperCase()) ||
            new RegExp("(?!.*DOUBLES)(?!.*CREWS)(?!.*LADDER).*MELEE.*").test(
              event.name.toUpperCase(),
            )
          ) {
            createEvent({
              tournament: tournament.name,
              id: tournament.id,
              meleeId: event.id,
              endAt: new Date(tournament.endAt * 1000).toLocaleDateString(),
              postalCode: tournament.postalCode,
            });
          }
        }),
    );
    return response.data.tournaments.nodes.length;
  } catch (error) {
    console.error("Error fetching events", error);
  }
}

export async function getEvents() {
  let page = 0;
  while (true) {
    if ((await getEventsPage(page)) === 0) return;
    page++;
  }
}
