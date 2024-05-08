import { db } from "../db";
import { sql } from "drizzle-orm";

export type match = {
  player_1_id: number;
  player_2_id: number;
  player_1_score: number;
  player_2_score: number;
  end_at: Date;
};

export async function getMatchesForId(id: number): Promise<match[]> {
  return await db.execute(sql`
    SELECT m.player_1_id, m.player_2_id, m.player_1_score, m.player_2_score, e.end_at
    FROM matches m
    JOIN events e ON m.event_id = e.melee_id
    WHERE m.player_1_id = ${id} OR m.player_2_id = ${id}
    ORDER BY e.end_at
	`);
}
