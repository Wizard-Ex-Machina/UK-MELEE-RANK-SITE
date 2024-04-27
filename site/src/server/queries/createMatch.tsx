import { log } from "console";
import { db } from "../db";
import { sql } from "drizzle-orm";

type Player = {
  event_id: number;
  start_gg_id: string;
  player_1_id: number;
  player_2_id: number;
  player_1_score: number;
  player_2_score: number;
};

export async function createMatch(player: Player): Promise<any> {
  const {
    event_id,
    start_gg_id,
    player_1_id,
    player_2_id,
    player_1_score,
    player_2_score,
  } = player;

  return await db.execute(sql`
   INSERT INTO matches ( event_id, start_gg_id, player_1_id, player_2_id,player_1_score,player_2_score) VALUES (${event_id}, ${start_gg_id}, ${player_1_id}, ${player_2_id}, ${player_1_score}, ${player_2_score}) ON CONFLICT (start_gg_id) DO NOTHING
	`);
}
