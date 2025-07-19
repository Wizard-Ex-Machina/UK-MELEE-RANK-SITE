// @ts-nocheck
import { and, desc, eq, inArray, sql } from "drizzle-orm";
import { db } from "@util";
import {
  events,
  matches,
  matchSlot,
  players,
  tournaments,
} from "../../../drizzle/schema";

export async function getLeaderboard(endDate = new Date()) {
  let startDate = new Date(endDate);
  startDate.setFullYear(startDate.getFullYear() - 1);

  const activePlayers = await db
    .select({
      playerId: matchSlot.playerId,
      matchCount: sql`COUNT(*)`.as("matchCount"), // Alias for matchCount
    })
    .from(matchSlot)
    .innerJoin(matches, eq(matchSlot.matchId, matches.matchId))
    .innerJoin(events, eq(matches.eventId, events.eventId))
    .innerJoin(tournaments, eq(events.tournamentId, tournaments.tournamentId))
    .where(
      and(
        sql`${tournaments.endAt} <= ${endDate}`,
        sql`${tournaments.endAt} >= ${startDate}`,
      ),
    )
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
    .innerJoin(events, eq(matches.eventId, events.eventId))
    .innerJoin(tournaments, eq(events.tournamentId, tournaments.tournamentId))
    .where(
      and(
        inArray(matchSlot.playerId, playerIds),
        sql`${tournaments.endAt} <= ${endDate}`,
      ),
    )
    .orderBy(matchSlot.playerId, desc(matches.createdAt)) // Ensure this matches the DISTINCT ON column
    .execute();

  return latestMatches
    .sort((a: any, b: any) => {
      if (a.r === b.r) return 0;
      if (a.r < b.r) return 1;
      return -1;
    })
    .map((player) => ({
      id: player.id,
      name: player.name,
      r: +player.r,
      rd: +player.rd,
    }));
}
