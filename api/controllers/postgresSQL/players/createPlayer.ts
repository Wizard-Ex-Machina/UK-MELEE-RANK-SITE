import { log } from "console";
import { pool } from "../../..";

export function createPlayer(
  name: string,
  startGGID: number,
  first_appears: string,
): Promise<{ id: number; name: string; start_gg_id: number }> {
  return new Promise((resolve, reject) => {
    pool.query(
      "INSERT INTO players (name, start_gg_id, first_appears) VALUES ($1, $2, $3) ON CONFLICT (start_gg_id) DO UPDATE SET name = $1 RETURNING *",
      [name, startGGID, first_appears],
      (error: any, result) => {
        if (error) {
          reject(error);
        }
        const player: { id: number; name: string; start_gg_id: number } =
          result.rows[0];
        resolve(player);
      },
    );
  });
}
