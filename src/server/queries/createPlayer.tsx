import { log } from "console";
import { db } from "../db";
import { sql } from "drizzle-orm";

type Player = {
  name: string;
  start_gg_id: number;
  first_appears: string;
};

export async function createPlayer(player: Player): Promise<any> {
  const { first_appears, name, start_gg_id } = player;

  return await db.execute(sql`
   INSERT INTO players (name, start_gg_id, first_appears) VALUES (${name}, ${start_gg_id}, ${first_appears}) ON CONFLICT (start_gg_id) DO UPDATE SET name = ${name} RETURNING *
	`);
}
