// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.26.0
// source: query.sql

package postgres

import (
	"context"

	"github.com/jackc/pgx/v5/pgtype"
)

const createEvent = `-- name: CreateEvent :one
INSERT INTO events (name, start_gg_id, tournament_id) VALUES ($1, $2, $3) RETURNING event_id, name, start_gg_id, tournament_id
`

type CreateEventParams struct {
	Name         string
	StartGgID    int32
	TournamentID int32
}

// This query will fail if the tournament_id does not exist
func (q *Queries) CreateEvent(ctx context.Context, arg CreateEventParams) (Event, error) {
	row := q.db.QueryRow(ctx, createEvent, arg.Name, arg.StartGgID, arg.TournamentID)
	var i Event
	err := row.Scan(
		&i.EventID,
		&i.Name,
		&i.StartGgID,
		&i.TournamentID,
	)
	return i, err
}

const createMatch = `-- name: CreateMatch :one
INSERT INTO matches (event_id) VALUES ($1) RETURNING match_id, event_id
`

// This query will fail if the event_id does not exist
// This query will fail if the start_gg_id already exists
func (q *Queries) CreateMatch(ctx context.Context, eventID int32) (Match, error) {
	row := q.db.QueryRow(ctx, createMatch, eventID)
	var i Match
	err := row.Scan(&i.MatchID, &i.EventID)
	return i, err
}

const createMatchSlot = `-- name: CreateMatchSlot :one
INSERT INTO match_slot (match_id, player_id, score, win, r, rd, sigma, delta) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING match_id, player_id, score, win, r, rd, sigma, delta
`

type CreateMatchSlotParams struct {
	MatchID  int32
	PlayerID int32
	Score    int32
	Win      bool
	R        pgtype.Numeric
	Rd       pgtype.Numeric
	Sigma    pgtype.Numeric
	Delta    pgtype.Numeric
}

// This query will fail if the match_id does not exist
// This query will fail if the player_id does not exist
// This query will fail if the player_id is already in the match
func (q *Queries) CreateMatchSlot(ctx context.Context, arg CreateMatchSlotParams) (MatchSlot, error) {
	row := q.db.QueryRow(ctx, createMatchSlot,
		arg.MatchID,
		arg.PlayerID,
		arg.Score,
		arg.Win,
		arg.R,
		arg.Rd,
		arg.Sigma,
		arg.Delta,
	)
	var i MatchSlot
	err := row.Scan(
		&i.MatchID,
		&i.PlayerID,
		&i.Score,
		&i.Win,
		&i.R,
		&i.Rd,
		&i.Sigma,
		&i.Delta,
	)
	return i, err
}

const createPlacement = `-- name: CreatePlacement :one
INSERT INTO placements (event_id, player_id, placement) VALUES ($1, $2, $3) RETURNING event_id, player_id, placement
`

type CreatePlacementParams struct {
	EventID   int32
	PlayerID  int32
	Placement int32
}

// This query will fail if the event_id does not exist
// This query will fail if the player_id does not exist
// This query will fail if the player_id is already in the event
func (q *Queries) CreatePlacement(ctx context.Context, arg CreatePlacementParams) (Placement, error) {
	row := q.db.QueryRow(ctx, createPlacement, arg.EventID, arg.PlayerID, arg.Placement)
	var i Placement
	err := row.Scan(&i.EventID, &i.PlayerID, &i.Placement)
	return i, err
}

const createPlayer = `-- name: CreatePlayer :one
INSERT INTO players (name, first_appearance) VALUES ($1, $2) RETURNING player_id, name, first_appearance
`

type CreatePlayerParams struct {
	Name            string
	FirstAppearance pgtype.Date
}

func (q *Queries) CreatePlayer(ctx context.Context, arg CreatePlayerParams) (Player, error) {
	row := q.db.QueryRow(ctx, createPlayer, arg.Name, arg.FirstAppearance)
	var i Player
	err := row.Scan(&i.PlayerID, &i.Name, &i.FirstAppearance)
	return i, err
}

const createPlayerAlias = `-- name: CreatePlayerAlias :one
INSERT INTO player_aliases (player_id, start_gg_id) VALUES ($1, $2) RETURNING player_id, start_gg_id
`

type CreatePlayerAliasParams struct {
	PlayerID  int32
	StartGgID int32
}

// This query will fail if the player_id does not exist
func (q *Queries) CreatePlayerAlias(ctx context.Context, arg CreatePlayerAliasParams) (PlayerAlias, error) {
	row := q.db.QueryRow(ctx, createPlayerAlias, arg.PlayerID, arg.StartGgID)
	var i PlayerAlias
	err := row.Scan(&i.PlayerID, &i.StartGgID)
	return i, err
}

const createRating = `-- name: CreateRating :one
INSERT INTO ratings (player_id, rating, rd, sigma, date) VALUES ($1, $2, $3, $4, $5)  RETURNING player_id, rating, rd, sigma, date
`

type CreateRatingParams struct {
	PlayerID int32
	Rating   float64
	Rd       float64
	Sigma    float64
	Date     pgtype.Date
}

// This query will fail if the player_id does not exist
// This query will fail if the player_id is already has a rating for that period
func (q *Queries) CreateRating(ctx context.Context, arg CreateRatingParams) (Rating, error) {
	row := q.db.QueryRow(ctx, createRating,
		arg.PlayerID,
		arg.Rating,
		arg.Rd,
		arg.Sigma,
		arg.Date,
	)
	var i Rating
	err := row.Scan(
		&i.PlayerID,
		&i.Rating,
		&i.Rd,
		&i.Sigma,
		&i.Date,
	)
	return i, err
}

const createTournament = `-- name: CreateTournament :one
INSERT INTO tournaments (name, postcode, end_at, slug)
VALUES ($1, $2, $3, $4)
RETURNING tournament_id, name, postcode, end_at, slug
`

type CreateTournamentParams struct {
	Name     string
	Postcode pgtype.Text
	EndAt    pgtype.Date
	Slug     string
}

// This query will fail if the slug already exists
func (q *Queries) CreateTournament(ctx context.Context, arg CreateTournamentParams) (Tournament, error) {
	row := q.db.QueryRow(ctx, createTournament,
		arg.Name,
		arg.Postcode,
		arg.EndAt,
		arg.Slug,
	)
	var i Tournament
	err := row.Scan(
		&i.TournamentID,
		&i.Name,
		&i.Postcode,
		&i.EndAt,
		&i.Slug,
	)
	return i, err
}

const currentLeaderboard = `-- name: CurrentLeaderboard :many
WITH recent_matches AS (
    -- Filter matches from tournaments that ended at least one week ago
    SELECT
        ms.player_id,
        ms.r,
        ms.rd,
        ms.match_id
    FROM
        match_slot ms
    JOIN
        matches m ON ms.match_id = m.match_id
    JOIN
        events e ON m.event_id = e.event_id
    JOIN
        tournaments t ON e.tournament_id = t.tournament_id
    WHERE
        t.end_at >= (CURRENT_DATE - INTERVAL '1 year')  -- Only consider tournaments from the last year
),

player_match_counts AS (
    -- Count matches in the past year plus one week per player and filter to those with at least 30 matches
    SELECT
        player_id,
        COUNT(*) AS match_count
    FROM
        recent_matches
    GROUP BY
        player_id
    HAVING
        COUNT(*) >= 30
),

latest_ratings AS (
    -- Get the latest rating and RD for each player based on their most recent match_id
    SELECT
        rm.player_id,
        rm.r AS latest_rating,
        rm.rd AS latest_rd
    FROM
        recent_matches rm
    JOIN
        (SELECT player_id, MAX(match_id) AS max_match_id
         FROM recent_matches
         GROUP BY player_id) latest
         ON rm.player_id = latest.player_id
         AND rm.match_id = latest.max_match_id
),

ranked_players AS (
    -- Rank players based on their latest ratings
    SELECT
        p.player_id AS PlayerID,
        p.name AS Name,
        RANK() OVER (ORDER BY lr.latest_rating DESC) AS Rank,
        lr.latest_rating AS R,
        lr.latest_rd AS Rd
    FROM
        players p
    JOIN
        player_match_counts pmc ON p.player_id = pmc.player_id
    JOIN
        latest_ratings lr ON p.player_id = lr.player_id
)

SELECT
    rp.PlayerID,
    rp.Name,
    rp.Rank,
    rp.R,
    rp.Rd
FROM
    ranked_players rp
ORDER BY
    rp.Rank
`

type CurrentLeaderboardRow struct {
	Playerid int32
	Name     string
	Rank     int64
	R        pgtype.Numeric
	Rd       pgtype.Numeric
}

func (q *Queries) CurrentLeaderboard(ctx context.Context) ([]CurrentLeaderboardRow, error) {
	rows, err := q.db.Query(ctx, currentLeaderboard)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []CurrentLeaderboardRow
	for rows.Next() {
		var i CurrentLeaderboardRow
		if err := rows.Scan(
			&i.Playerid,
			&i.Name,
			&i.Rank,
			&i.R,
			&i.Rd,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const getMostRecentTournament = `-- name: GetMostRecentTournament :one
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
LIMIT 1
`

// This query will fail if there are no tournaments
func (q *Queries) GetMostRecentTournament(ctx context.Context) (Tournament, error) {
	row := q.db.QueryRow(ctx, getMostRecentTournament)
	var i Tournament
	err := row.Scan(
		&i.TournamentID,
		&i.Name,
		&i.Postcode,
		&i.EndAt,
		&i.Slug,
	)
	return i, err
}

const getPlayerAliase = `-- name: GetPlayerAliase :one
SELECT player_id, start_gg_id FROM player_aliases WHERE start_gg_id = $1
`

func (q *Queries) GetPlayerAliase(ctx context.Context, startGgID int32) (PlayerAlias, error) {
	row := q.db.QueryRow(ctx, getPlayerAliase, startGgID)
	var i PlayerAlias
	err := row.Scan(&i.PlayerID, &i.StartGgID)
	return i, err
}

const getPlayerFromAlias = `-- name: GetPlayerFromAlias :one
SELECT player_id, name, first_appearance FROM players WHERE player_id = (SELECT player_id FROM player_aliases WHERE start_gg_id = $1)
`

// This query will fail if the start_gg_id does not exist
func (q *Queries) GetPlayerFromAlias(ctx context.Context, startGgID int32) (Player, error) {
	row := q.db.QueryRow(ctx, getPlayerFromAlias, startGgID)
	var i Player
	err := row.Scan(&i.PlayerID, &i.Name, &i.FirstAppearance)
	return i, err
}

const getPlayers = `-- name: GetPlayers :many
SELECT player_id, name, first_appearance FROM players
`

func (q *Queries) GetPlayers(ctx context.Context) ([]Player, error) {
	rows, err := q.db.Query(ctx, getPlayers)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []Player
	for rows.Next() {
		var i Player
		if err := rows.Scan(&i.PlayerID, &i.Name, &i.FirstAppearance); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const getRating = `-- name: GetRating :one
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
LIMIT 1
`

// This query will fail if the player_id does not exist
func (q *Queries) GetRating(ctx context.Context, playerID int32) (MatchSlot, error) {
	row := q.db.QueryRow(ctx, getRating, playerID)
	var i MatchSlot
	err := row.Scan(
		&i.MatchID,
		&i.PlayerID,
		&i.Score,
		&i.Win,
		&i.R,
		&i.Rd,
		&i.Sigma,
		&i.Delta,
	)
	return i, err
}

const lastWeekLeaderboard = `-- name: LastWeekLeaderboard :many
WITH recent_matches AS (
    -- Filter matches from tournaments that ended at least one week ago
    SELECT
        ms.player_id,
        ms.r,
        ms.rd,
        ms.match_id
    FROM
        match_slot ms
    JOIN
        matches m ON ms.match_id = m.match_id
    JOIN
        events e ON m.event_id = e.event_id
    JOIN
        tournaments t ON e.tournament_id = t.tournament_id
    WHERE
        t.end_at <= (CURRENT_DATE - INTERVAL '1 week')  -- Tournament ended at least one week ago
),

player_match_counts AS (
    -- Count matches in the past year plus one week per player and filter to those with at least 30 matches
    SELECT
        ms.player_id,
        COUNT(*) AS match_count
    FROM
        match_slot ms
    JOIN
        matches m ON ms.match_id = m.match_id
    JOIN
        events e ON m.event_id = e.event_id
    JOIN
        tournaments t ON e.tournament_id = t.tournament_id
    WHERE
        t.end_at <= (CURRENT_DATE - INTERVAL '1 week')  -- Ensure only tournaments that ended at least a week ago are considered
        AND t.end_at >= (CURRENT_DATE - INTERVAL '53 weeks')  -- Include matches from the past year plus one week
    GROUP BY
        ms.player_id
    HAVING
        COUNT(*) >= 30  -- Filter to those with at least 30 matches
),

latest_ratings AS (
    -- Get only the latest rating and RD for each player based on their most recent match_id
    SELECT
        rm.player_id,
        rm.r AS latest_rating,
        rm.rd AS latest_rd
    FROM
        recent_matches rm
    JOIN
        (SELECT player_id, MAX(match_id) AS max_match_id
         FROM recent_matches
         GROUP BY player_id) latest
         ON rm.player_id = latest.player_id
         AND rm.match_id = latest.max_match_id
)

SELECT
    p.player_id AS PlayerID,
    p.name AS Name,
    RANK() OVER (ORDER BY lr.latest_rating DESC) AS Rank,
    lr.latest_rating AS R,
    lr.latest_rd AS Rd
FROM
    players p
JOIN
    player_match_counts pmc ON p.player_id = pmc.player_id
JOIN
    latest_ratings lr ON p.player_id = lr.player_id
ORDER BY
    Rank
`

type LastWeekLeaderboardRow struct {
	Playerid int32
	Name     string
	Rank     int64
	R        pgtype.Numeric
	Rd       pgtype.Numeric
}

func (q *Queries) LastWeekLeaderboard(ctx context.Context) ([]LastWeekLeaderboardRow, error) {
	rows, err := q.db.Query(ctx, lastWeekLeaderboard)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []LastWeekLeaderboardRow
	for rows.Next() {
		var i LastWeekLeaderboardRow
		if err := rows.Scan(
			&i.Playerid,
			&i.Name,
			&i.Rank,
			&i.R,
			&i.Rd,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}
