import { db } from "../db";
import { sql } from "drizzle-orm";

export type match = {
  player_1_id: number;
  player_2_id: number;
  player_1_score: number;
  player_2_score: number;
};

export async function getMatchesInEvent(id: number): Promise<match[]> {
  return await db.execute(sql`
    SELECT m.*
    FROM matches m
    WHERE m.event_id= ${id}

	`);
}
