-- name: GetPlayers :many
SELECT * FROM players;

-- name: CreatePlayer :one
INSERT INTO players (name, first_appearance) VALUES ($1, $2) RETURNING *;

-- name: GetPlayerAliase :one
SELECT * FROM player_aliases WHERE start_gg_id = $1;

-- name: GetPlayerFromAlias :one
-- This query will fail if the start_gg_id does not exist
SELECT * FROM players WHERE player_id = (SELECT player_id FROM player_aliases WHERE start_gg_id = $1);


-- name: CreatePlayerAlias :one
-- This query will fail if the player_id does not exist
INSERT INTO player_aliases (player_id, start_gg_id) VALUES ($1, $2) RETURNING *;

-- name: CreateTournament :one
-- This query will fail if the slug already exists
INSERT INTO tournaments (name, postcode, end_at, slug)
VALUES ($1, $2, $3, $4)
RETURNING *;

-- name: CreateEvent :one
-- This query will fail if the tournament_id does not exist
INSERT INTO events (name, start_gg_id, tournament_id) VALUES ($1, $2, $3) RETURNING *;

-- name: CreateMatch :one
-- This query will fail if the event_id does not exist
-- This query will fail if the start_gg_id already exists
INSERT INTO matches (event_id, start_gg_id) VALUES ($1, $2) RETURNING *;

-- name: CreateMatchSlot :one
-- This query will fail if the match_id does not exist
-- This query will fail if the player_id does not exist
-- This query will fail if the player_id is already in the match
INSERT INTO match_slot (match_id, player_id, score, win) VALUES ($1, $2, $3, $4) RETURNING *;

-- name: CreatePlacement :one
-- This query will fail if the event_id does not exist
-- This query will fail if the player_id does not exist
-- This query will fail if the player_id is already in the event
INSERT INTO placements (event_id, player_id, placement) VALUES ($1, $2, $3) RETURNING *;

-- name: CreateRating :one
-- This query will fail if the player_id does not exist
-- This query will fail if the player_id is already has a rating for that period
INSERT INTO ratings (player_id, rating, rd, sigma, date) VALUES ($1, $2, $3, $4, $5)  RETURNING *;
