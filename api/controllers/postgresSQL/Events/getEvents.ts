import { pool } from "../../..";

export function getEvents(): Promise<any[]> {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT * FROM events ORDER BY end_at ASC",
      (error: any, results: any) => {
        if (error) {
          reject(error);
        }
        resolve(results.rows);
      },
    );
  });
}
