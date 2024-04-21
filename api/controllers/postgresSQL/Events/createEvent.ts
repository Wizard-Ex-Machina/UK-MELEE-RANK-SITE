import { pool } from "../../..";

export function createEvent(Event: {
  tournament: string;
  id: number;
  meleeId: number;
  endAt: string;
  postalCode: string;
}) {
  pool.query(
    "INSERT INTO events (name, start_gg_id, melee_id, end_at, postal_code) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (melee_id) DO NOTHING RETURNING *",
    [Event.tournament, Event.id, Event.meleeId, Event.endAt, Event.postalCode],
    (error: any) => {
      if (error) {
        throw error;
      }
    },
  );
}
