import { pool } from "../../..";

export function getMatchesInPeriod(start: string, end: string): Promise<any[]> {
  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT events.name, matches.player_1_id, matches.player_2_id, matches.player_1_score, matches.player_2_score FROM events RIGHT JOIN matches ON events.melee_id = matches.event_id WHERE events.end_at BETWEEN '${start}' AND '${end}'`,
      (error: any, results: any) => {
        if (error) {
          reject(error);
        }
        resolve(results.rows);
      },
    );
  });
}
