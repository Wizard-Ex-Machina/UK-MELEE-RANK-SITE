import { db } from "../db";
import { sql } from "drizzle-orm";
export type Event = {
  tournament: string;
  id: number;
  meleeId: number;
  endAt: Date;
  postalCode: string;
};
export async function createEvent(event: Event): Promise<any> {
  const { tournament, id, meleeId, endAt, postalCode } = event;
  return await db.execute(sql`
    INSERT INTO events (name, start_gg_id, melee_id, end_at, postal_code) VALUES (${tournament}, ${id}, ${meleeId}, ${endAt}, ${postalCode}) ON CONFLICT (melee_id) DO NOTHING RETURNING *
	`);
}
