// @ts-nocheck

import { events, tournaments, placements } from "../../../../../drizzle/schema";
import { eq } from "drizzle-orm";
import { db } from "@util";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("player");

  if (!id) {
    return NextResponse.json(
      { error: "Missing id parameter" },
      { status: 400 },
    );
  }

  const placementsQuery = await db
    .select({
      tournament: tournaments.name,
      placement: placements.placement,
    })
    .from(placements)
    .where(eq(placements.playerId, id))
    .innerJoin(events, eq(events.eventId, placements.eventId))
    .innerJoin(tournaments, eq(tournaments.tournamentId, events.tournamentId));

  return NextResponse.json(placementsQuery);
}
