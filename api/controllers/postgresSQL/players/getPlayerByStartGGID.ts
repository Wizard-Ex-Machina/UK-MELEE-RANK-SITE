import { pool } from "../../..";

export function getPlayer(id: number) {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT * FROM players WHERE start_gg_id = $1",
      [id],
      (error: any, results: any) => {
        if (error) {
          reject(error);
        }
        resolve(results.rows[0]);
      },
    );
  });
}
