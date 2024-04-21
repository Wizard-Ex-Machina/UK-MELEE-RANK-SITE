import { pool } from "../../..";
import { Match } from "../../../util/setTranformer";

export function createMatch(match: Match) {
  pool.query(
    "INSERT INTO matches ( event_id, start_gg_id, player_1_id, player_2_id,player_1_score,player_2_score) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (start_gg_id) DO NOTHING",
    [
      match.eventID,
      match.startGGID,
      match.player1ID,
      match.player2ID,
      match.player1Score,
      match.player2Score,
    ],
    (error: any) => {
      if (error) {
        throw error;
      }
    },
  );
}
