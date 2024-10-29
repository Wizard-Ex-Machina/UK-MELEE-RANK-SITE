-- name: GetPlayers :many
SELECT * FROM players;

-- name: CreatePlayer :one
INSERT INTO players (name, first_appearance) VALUES ($1, $2) RETURNING *;

-- name: GetPlayerAliase :one
SELECT * FROM player_aliases WHERE start_gg_id = $1;

-- name: GetPlayerFromAlias :one
-- This query will fail if the start_gg_id does not exist
SELECT * FROM players WHERE player_id = (SELECT player_id FROM player_aliases WHERE start_gg_id = $1);

-- name: GetRating :one
-- This query will fail if the player_id does not exist
SELECT
    ms.match_id,
    ms.player_id,
    ms.score,
    ms.win,
    ms.r,
    ms.rd,
    ms.sigma,
    ms.delta
FROM
    match_slot ms
JOIN
    matches m ON ms.match_id = m.match_id
JOIN
    events e ON m.event_id = e.event_id
JOIN
    tournaments t ON e.tournament_id = t.tournament_id
WHERE
    ms.player_id = $1
ORDER BY
    t.end_at DESC
LIMIT 1;

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
INSERT INTO matches (event_id) VALUES ($1) RETURNING *;

-- name: CreateMatchSlot :one
-- This query will fail if the match_id does not exist
-- This query will fail if the player_id does not exist
-- This query will fail if the player_id is already in the match
INSERT INTO match_slot (match_id, player_id, score, win, r, rd, sigma, delta) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *;

-- name: CreatePlacement :one
-- This query will fail if the event_id does not exist
-- This query will fail if the player_id does not exist
-- This query will fail if the player_id is already in the event
INSERT INTO placements (event_id, player_id, placement) VALUES ($1, $2, $3) RETURNING *;

-- name: CreateRating :one
-- This query will fail if the player_id does not exist
-- This query will fail if the player_id is already has a rating for that period
INSERT INTO ratings (player_id, rating, rd, sigma, date) VALUES ($1, $2, $3, $4, $5)  RETURNING *;

-- name: GetMostRecentTournament :one
-- This query will fail if there are no tournaments
SELECT
    tournament_id,
    name,
    postcode,
    end_at,
    slug
FROM
    tournaments
ORDER BY
    end_at DESC
LIMIT 1;
