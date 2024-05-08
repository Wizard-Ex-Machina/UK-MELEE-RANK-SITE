import { log } from "console";
import { db } from "../db";
import { sql } from "drizzle-orm";

type Props = {
  start: Date;
  end: Date;
};

export async function getMatchesInPeriod(props: Props): Promise<any> {
  log(props.start, props.end);
  return await db.execute(sql`
    SELECT events.name, matches.player_1_id, matches.player_2_id, matches.player_1_score, matches.player_2_score FROM events RIGHT JOIN matches ON events.melee_id = matches.event_id WHERE events.end_at BETWEEN ${props.start.toDateString()} AND ${props.end.toDateString()}
	`);
}
