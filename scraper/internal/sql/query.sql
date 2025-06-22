-- name: getPlayer :one
SELECT * FROM players WHERE player_id = $1;

-- name: GetPlayerAliase :one
SELECT * FROM player_aliases WHERE start_gg_id = $1;

-- name: GetPlayerFromAlias :one
-- This query will fail if the start_gg_id does not exist
SELECT * FROM players WHERE player_id = (SELECT player_id FROM player_aliases WHERE start_gg_id = $1);

-- name: CreatePlayer :one

-- name: CreatePlayer :one
WITH new_player AS (
  INSERT INTO players (name, first_appearance)
  VALUES ($1, $2)
  RETURNING *
),
alias_insert AS (
  INSERT INTO player_aliases (player_id, start_gg_id)
  SELECT player_id, $3 FROM new_player
)
SELECT * FROM new_player;

-- name: CreateTournament :one
INSERT INTO tournaments (name, postcode, end_at, country_code, slug)
VALUES ($1, $2, $3, $4, $5)
RETURNING *;

-- name: CreateEvent :one
INSERT INTO events ( name, start_gg_id, tournament_id)
VALUES ($1,$2,$3)
RETURNING *;

-- name: GetMostRecentMatchForPlayer :one
SELECT ms.*
FROM match_slot ms
JOIN matches m ON ms.match_id = m.match_id
WHERE ms.player_id = $1
ORDER BY m.created_at DESC
LIMIT 1;

-- name: CreateMatch :one
INSERT INTO matches (event_id)
VALUES ($1)
RETURNING *;

-- name: CreateMatchSlot :one
INSERT INTO match_slot (match_id, player_id, score, win, r, rd, sigma, delta)
VALUES ($1, $2, $3, $4, $5,$6,$7,$8)
RETURNING *;

-- name: CreateCharacterData :one
INSERT INTO match_characters (match_id, player_id, game_number, win, pre_rating, character_id)
VALUES ($1, $2, $3, $4, $5, $6)
RETURNING *;
