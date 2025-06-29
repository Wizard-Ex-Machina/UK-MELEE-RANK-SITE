import db from "@/app/_util/db";
import { NextRequest } from "next/server";
import {
  events,
  matches as matchesTable,
  matchSlot,
  players,
  tournaments,
} from "../../../../../drizzle/schema"; // Use 'matches' as 'matchesTable'
import { aliasedTable, and, desc, eq, ne, sql } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const reqParams = req.nextUrl.searchParams;
  const player = reqParams.get("player");

  if (!player) {
    return Response.status(404).json({ error: "Player not found" });
  }

  const playerMatches = await db
    .selectDistinctOn([tournaments.tournamentId], {
      tournament: tournaments.name,
      endAt: tournaments.endAt,
      r: matchSlot.r,
    })
    .from(matchSlot)
    .innerJoin(matchesTable, eq(matchesTable.matchId, matchSlot.matchId))
    .innerJoin(events, eq(events.eventId, matchesTable.eventId))
    .innerJoin(tournaments, eq(tournaments.tournamentId, events.tournamentId))
    .where(eq(matchSlot.playerId, player))
    .orderBy(desc(tournaments.tournamentId))
    .execute();

  return Response.json(playerMatches);
}
