// @ts-nocheck
import { db } from "@util";
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
    return new Response("Player not found", { status: 404 });
  }

  // Create an alias for the second instance of matchSlot
  const opponentMatchSlot = aliasedTable(matchSlot, "opponentMatchSlot");
  const opponentPlayer = aliasedTable(players, "opponentPlayer"); // Join with the players table

  const playerMatches = await db
    .select({
      tournament: tournaments.name,
      name: players.name,
      playerId: matchSlot.playerId,
      matchId: matchSlot.matchId,
      win: matchSlot.win,
      delta: matchSlot.delta,
      score: matchSlot.score,
      opponentName: opponentPlayer.name,
      opponentId: sql`${opponentMatchSlot.playerId}`,
      opponentScore: sql`${opponentMatchSlot.score}`,
    })
    .from(matchSlot)
    .innerJoin(matchesTable, eq(matchesTable.matchId, matchSlot.matchId))
    .innerJoin(
      opponentMatchSlot,
      and(
        eq(opponentMatchSlot.matchId, matchSlot.matchId),
        ne(opponentMatchSlot.playerId, matchSlot.playerId),
      ),
    )
    .innerJoin(events, eq(events.eventId, matchesTable.eventId))
    .innerJoin(tournaments, eq(tournaments.tournamentId, events.tournamentId))
    .innerJoin(
      opponentPlayer,
      eq(opponentPlayer.playerId, opponentMatchSlot.playerId),
    )
    .innerJoin(players, eq(players.playerId, matchSlot.playerId))
    .where(eq(matchSlot.playerId, player))
    .orderBy(desc(matchesTable.createdAt))
    .execute();

  try {
    const opponents = [];
    playerMatches.forEach(({ opponentId, name }) => {
      opponents.push({ id: opponentId, name: name });
    });

    const finalData = opponents.map((opponent) => {
      const matches = playerMatches.filter(
        ({ opponentId }) => opponent.id == opponentId,
      );
      matches.reduce((acc, curr) => {
        acc = {
          wins: acc.wins + curr.score,
          loses: acc.loses + curr.opponentScore,
        };
      });
      console.log(acc);
      return { ...opponent, ...acc };
    });

    return Response.json(finalData);
  } catch (err) {
    console.log("testerr");
    return Response.json(err);
  }
}
