import { desc, eq, inArray, sql } from "drizzle-orm";
import db from "../../_util/db";
import { NextRequest, NextResponse } from "next/server";
import {
  events,
  matches,
  matchSlot,
  players,
  tournaments,
} from "../../../../drizzle/schema";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const date = new Date(searchParams.get("date") || Date.now());
  console.log(req.url.toString());
  const activePlayers = await db
    .select({
      playerId: matchSlot.playerId,
      matchCount: sql`COUNT(*)`.as("matchCount"), // Alias for matchCount
    })
    .from(matchSlot)
    .innerJoin(matches, eq(matchSlot.matchId, matches.matchId))
    .innerJoin(events, eq(matches.eventId, events.eventId))
    .innerJoin(tournaments, eq(events.tournamentId, tournaments.tournamentId))
    .where(sql`${tournaments.endAt} >= ${date}`)
    .groupBy(matchSlot.playerId)
    .having(sql`COUNT(*) > 30`) // Ensure only players with more than 30 matches
    .execute();
  const playerIds = activePlayers.map((player) => player.playerId);

  const latestMatches = await db
    .selectDistinctOn([matchSlot.playerId], {
      id: matchSlot.playerId,
      name: players.name,
      r: matchSlot.r,
      rd: matchSlot.rd,
    })
    .from(matchSlot)
    .innerJoin(matches, eq(matchSlot.matchId, matches.matchId))
    .innerJoin(players, eq(matchSlot.playerId, players.playerId))
    .where(inArray(matchSlot.playerId, playerIds))
    .orderBy(matchSlot.playerId, desc(matches.createdAt)) // Ensure this matches the DISTINCT ON column
    .execute();

  return Response.json(
    latestMatches.sort((a: any, b: any) => {
      if (a.r === b.r) return 0;
      if (a.r < b.r) return 1;
      return -1;
    }),
  );
}
