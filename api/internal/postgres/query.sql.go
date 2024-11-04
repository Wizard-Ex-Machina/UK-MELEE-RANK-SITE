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

// Orders by the most recent tournaments
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

const getMatchHistory = `-- name: GetMatchHistory :many
SELECT
    ms1.match_id AS MatchID,
    ms1.player_id AS PlayerID,
    p1.name AS PlayerName,
    ms2.player_id AS OpponentID,
    p2.name AS OpponentName,
    ms1.score AS PlayerScore,
    ms1.delta AS RatingChange,
    ms2.score AS OpponentScore,
    ms1.win AS PlayerWin
FROM
    match_slot ms1
JOIN
    match_slot ms2 ON ms1.match_id = ms2.match_id AND ms1.player_id != ms2.player_id
JOIN
    matches m ON ms1.match_id = m.match_id
JOIN
    events e ON m.event_id = e.event_id
JOIN
    players p1 ON ms1.player_id = p1.player_id
JOIN
    players p2 ON ms2.player_id = p2.player_id
WHERE
    ms1.player_id = $1  -- Replace 123 with the player ID you're interested in
ORDER BY
    ms1.match_id DESC  -- Order by the most recent matches
LIMIT 250
`

type GetMatchHistoryRow struct {
	Matchid       int32
	Playerid      int32
	Playername    string
	Opponentid    int32
	Opponentname  string
	Playerscore   int32
	Ratingchange  pgtype.Numeric
	Opponentscore int32
	Playerwin     bool
}

// Get the match history for the specified player
func (q *Queries) GetMatchHistory(ctx context.Context, playerID int32) ([]GetMatchHistoryRow, error) {
	rows, err := q.db.Query(ctx, getMatchHistory, playerID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []GetMatchHistoryRow
	for rows.Next() {
		var i GetMatchHistoryRow
		if err := rows.Scan(
			&i.Matchid,
			&i.Playerid,
			&i.Playername,
			&i.Opponentid,
			&i.Opponentname,
			&i.Playerscore,
			&i.Ratingchange,
			&i.Opponentscore,
			&i.Playerwin,
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

const getMatchesPerQuartrer = `-- name: GetMatchesPerQuartrer :many
SELECT
    EXTRACT(YEAR FROM t.end_at) AS year,         -- Extracting the year from tournament end date
    EXTRACT(QUARTER FROM t.end_at) AS quarter,   -- Extracting the quarter from tournament end date
    COUNT(m.match_id) AS number_of_matches         -- Counting the number of matches
FROM
    matches m
JOIN
    events e ON m.event_id = e.event_id
JOIN
    tournaments t ON e.tournament_id = t.tournament_id
GROUP BY
    year, quarter                                -- Grouping by year and quarter
ORDER BY
    year, quarter
`

type GetMatchesPerQuartrerRow struct {
	Year            pgtype.Numeric
	Quarter         pgtype.Numeric
	NumberOfMatches int64
}

func (q *Queries) GetMatchesPerQuartrer(ctx context.Context) ([]GetMatchesPerQuartrerRow, error) {
	rows, err := q.db.Query(ctx, getMatchesPerQuartrer)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []GetMatchesPerQuartrerRow
	for rows.Next() {
		var i GetMatchesPerQuartrerRow
		if err := rows.Scan(&i.Year, &i.Quarter, &i.NumberOfMatches); err != nil {
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

const getOpponentRecords = `-- name: GetOpponentRecords :many
WITH opponent_latest_ratings AS (
    -- Get the latest match rating for each opponent
    SELECT
        ms.player_id AS OpponentID,
        ms.r AS OpponentRating
    FROM
        match_slot ms
    JOIN
        (SELECT player_id, MAX(match_id) AS latest_match_id
         FROM match_slot
         GROUP BY player_id) latest_match
         ON ms.player_id = latest_match.player_id
         AND ms.match_id = latest_match.latest_match_id
)

SELECT
    ms2.player_id AS OpponentID,
    p2.name AS OpponentName,
    SUM(CASE WHEN ms1.win = TRUE THEN 1 ELSE 0 END) AS Wins,
    SUM(CASE WHEN ms1.win = FALSE THEN 1 ELSE 0 END) AS Losses,
    olr.OpponentRating AS OpponentMostRecentRating
FROM
    match_slot ms1
JOIN
    match_slot ms2 ON ms1.match_id = ms2.match_id AND ms1.player_id != ms2.player_id
JOIN
    players p1 ON ms1.player_id = p1.player_id
JOIN
    players p2 ON ms2.player_id = p2.player_id
JOIN
    opponent_latest_ratings olr ON ms2.player_id = olr.OpponentID
WHERE
    ms1.player_id = $1  -- Replace 123 with the desired player_id
GROUP BY
    ms1.player_id, p1.name, ms2.player_id, p2.name, olr.OpponentRating
ORDER BY
    olr.OpponentRating DESC
`

type GetOpponentRecordsRow struct {
	Opponentid               int32
	Opponentname             string
	Wins                     int64
	Losses                   int64
	Opponentmostrecentrating pgtype.Numeric
}

// Get the win-loss-draw record against each opponent for the specified player
func (q *Queries) GetOpponentRecords(ctx context.Context, playerID int32) ([]GetOpponentRecordsRow, error) {
	rows, err := q.db.Query(ctx, getOpponentRecords, playerID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []GetOpponentRecordsRow
	for rows.Next() {
		var i GetOpponentRecordsRow
		if err := rows.Scan(
			&i.Opponentid,
			&i.Opponentname,
			&i.Wins,
			&i.Losses,
			&i.Opponentmostrecentrating,
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
WHERE
    ms.player_id = $1
ORDER BY
    ms.match_id DESC
LIMIT 1
FOR UPDATE
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

const getRatingDistribution = `-- name: GetRatingDistribution :many
WITH latest_ratings AS (
    -- Get the most recent rating and rd for each player based on the maximum match_id
    SELECT
        ms.player_id,
        ms.r AS rating,
        ms.rd
    FROM
        match_slot ms
    JOIN
        (SELECT player_id, MAX(match_id) AS max_match_id
         FROM match_slot
         GROUP BY player_id) latest_match
    ON ms.player_id = latest_match.player_id
    AND ms.match_id = latest_match.max_match_id
    WHERE
        ms.rd < 70 -- Filter for players with rd less than 100
),

binned_ratings AS (
    -- Bin players' most recent ratings for the histogram using bin midpoints
    SELECT
        CASE
        	WHEN rating >= 3250 THEN 3275
            WHEN rating >= 3200 THEN 3225
        	WHEN rating >= 3150 THEN 3175
            WHEN rating >= 3100 THEN 3125
        	WHEN rating >= 3050 THEN 3075
            WHEN rating >= 3000 THEN 3025
            WHEN rating >= 2950 THEN 2975
            WHEN rating >= 2900 THEN 2925
            WHEN rating >= 2850 THEN 2875
            WHEN rating >= 2800 THEN 2825
            WHEN rating >= 2750 THEN 2775
            WHEN rating >= 2700 THEN 2725
            WHEN rating >= 2650 THEN 2675
            WHEN rating >= 2600 THEN 2625
            WHEN rating >= 2550 THEN 2575
            WHEN rating >= 2500 THEN 2525
            WHEN rating >= 2450 THEN 2475
            WHEN rating >= 2400 THEN 2425
            WHEN rating >= 2350 THEN 2375
            WHEN rating >= 2300 THEN 2325
            WHEN rating >= 2250 THEN 2275
            WHEN rating >= 2200 THEN 2225
            WHEN rating >= 2150 THEN 2175
            WHEN rating >= 2100 THEN 2125
            WHEN rating >= 2050 THEN 2075
            WHEN rating >= 2000 THEN 2025
            WHEN rating >= 1950 THEN 1975
            WHEN rating >= 1900 THEN 1925
            WHEN rating >= 1850 THEN 1875
            WHEN rating >= 1800 THEN 1825
            WHEN rating >= 1750 THEN 1775
            WHEN rating >= 1700 THEN 1725
            WHEN rating >= 1650 THEN 1675
            WHEN rating >= 1600 THEN 1625
            WHEN rating >= 1550 THEN 1575
            WHEN rating >= 1500 THEN 1525

            ELSE 50
        END AS RatingMidpoint,
        COUNT(*) AS PlayerCount
    FROM
        latest_ratings
    GROUP BY
        RatingMidpoint
)

SELECT
    RatingMidpoint,
    PlayerCount
FROM
    binned_ratings
ORDER BY
    RatingMidpoint DESC
`

type GetRatingDistributionRow struct {
	Ratingmidpoint int32
	Playercount    int64
}

// Order by the rating midpoints for easier histogram plotting
func (q *Queries) GetRatingDistribution(ctx context.Context) ([]GetRatingDistributionRow, error) {
	rows, err := q.db.Query(ctx, getRatingDistribution)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []GetRatingDistributionRow
	for rows.Next() {
		var i GetRatingDistributionRow
		if err := rows.Scan(&i.Ratingmidpoint, &i.Playercount); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const getRatingHistory = `-- name: GetRatingHistory :many
WITH latest_event_matches AS (
    -- For the specified player, find the latest match_id in each event they attended
    SELECT
        ms.player_id,
        m.event_id,
        MAX(ms.match_id) AS latest_match_id
    FROM
        match_slot ms
    JOIN
        matches m ON ms.match_id = m.match_id
    WHERE
        ms.player_id = $1 -- Player ID parameter
    GROUP BY
        ms.player_id, m.event_id
)

SELECT
    p.player_id AS PlayerID,
    p.name AS Name,
    e.event_id AS EventID,
    e.name AS EventName,
    t.name AS TournamentName,
    t.end_at AS TournamentDate,
    ms.r AS Rating,
    ms.rd AS RatingDeviation
FROM
    latest_event_matches lem
JOIN
    match_slot ms ON lem.latest_match_id = ms.match_id AND ms.player_id = lem.player_id  -- Ensure only the specified player’s match slot
JOIN
    players p ON lem.player_id = p.player_id
JOIN
    events e ON lem.event_id = e.event_id
JOIN
    tournaments t ON e.tournament_id = t.tournament_id
ORDER BY
    e.event_id
`

type GetRatingHistoryRow struct {
	Playerid        int32
	Name            string
	Eventid         int32
	Eventname       string
	Tournamentname  string
	Tournamentdate  pgtype.Date
	Rating          pgtype.Numeric
	Ratingdeviation pgtype.Numeric
}

func (q *Queries) GetRatingHistory(ctx context.Context, playerID int32) ([]GetRatingHistoryRow, error) {
	rows, err := q.db.Query(ctx, getRatingHistory, playerID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []GetRatingHistoryRow
	for rows.Next() {
		var i GetRatingHistoryRow
		if err := rows.Scan(
			&i.Playerid,
			&i.Name,
			&i.Eventid,
			&i.Eventname,
			&i.Tournamentname,
			&i.Tournamentdate,
			&i.Rating,
			&i.Ratingdeviation,
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

const getRecentPlacements = `-- name: GetRecentPlacements :many



SELECT
    p.player_id AS PlayerID,
    p.name AS PlayerName,
    t.name AS TournamentName,
    t.end_at AS TournamentDate,
    t.tournament_id as TournamentID,
    pl.placement AS Placement,
    event_counts.total_players AS TotalPlayers
FROM
    placements pl
JOIN
    events e ON pl.event_id = e.event_id
JOIN
    tournaments t ON e.tournament_id = t.tournament_id
JOIN
    players p ON pl.player_id = p.player_id
JOIN
    (SELECT
         event_id,
         COUNT(DISTINCT player_id) AS total_players
     FROM
         placements
     GROUP BY
         event_id) event_counts ON pl.event_id = event_counts.event_id
WHERE
    pl.player_id = $1  -- Replace 123 with the desired player ID
ORDER BY
    t.end_at DESC
`

type GetRecentPlacementsRow struct {
	Playerid       int32
	Playername     string
	Tournamentname string
	Tournamentdate pgtype.Date
	Tournamentid   int32
	Placement      int32
	Totalplayers   int64
}

// Ordering by year and quarter
// Get the recent placements for the specified player
func (q *Queries) GetRecentPlacements(ctx context.Context, playerID int32) ([]GetRecentPlacementsRow, error) {
	rows, err := q.db.Query(ctx, getRecentPlacements, playerID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []GetRecentPlacementsRow
	for rows.Next() {
		var i GetRecentPlacementsRow
		if err := rows.Scan(
			&i.Playerid,
			&i.Playername,
			&i.Tournamentname,
			&i.Tournamentdate,
			&i.Tournamentid,
			&i.Placement,
			&i.Totalplayers,
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

const getWinRateByRatingDifference = `-- name: GetWinRateByRatingDifference :many
WITH player_match_stats AS (
    -- Calculate the rating difference for each match slot where player_id differs (opponent)
    -- Only include matches where the player's rating is 2500 or above
    SELECT
        ms1.player_id AS PlayerID,
        ms1.match_id AS MatchID,
        ms1.win AS PlayerWin,
        ((ms1.r - ms1.delta) - (ms2.r - ms2.delta)) AS RatingDifference
    FROM
        match_slot ms1
    JOIN
        match_slot ms2 ON ms1.match_id = ms2.match_id
        AND ms1.player_id != ms2.player_id
    WHERE
        ms1.r >= $1  -- Filter to only include matches where the player’s rating is 2500 or above
        AND ms1.rd < 100
        AND ms2.rd < 100
),

rating_ranges AS (
    -- Assign each rating difference into 50-point bins and use the midpoint as the label
    SELECT
        PlayerID,
        CASE
            WHEN RatingDifference BETWEEN 550 AND 599 THEN '575'
            WHEN RatingDifference BETWEEN 500 AND 549 THEN '525'
            WHEN RatingDifference BETWEEN 450 AND 499 THEN '475'
            WHEN RatingDifference BETWEEN 400 AND 449 THEN '425'
            WHEN RatingDifference BETWEEN 350 AND 399 THEN '375'
            WHEN RatingDifference BETWEEN 300 AND 349 THEN '325'
            WHEN RatingDifference BETWEEN 250 AND 299 THEN '275'
            WHEN RatingDifference BETWEEN 200 AND 249 THEN '225'
            WHEN RatingDifference BETWEEN 150 AND 199 THEN '175'
            WHEN RatingDifference BETWEEN 100 AND 149 THEN '125'
            WHEN RatingDifference BETWEEN 50 AND 99 THEN '75'
            WHEN RatingDifference BETWEEN 0 AND 49 THEN '25'
            WHEN RatingDifference BETWEEN -50 AND -1 THEN '-25'
            WHEN RatingDifference BETWEEN -100 AND -51 THEN '-75'
            WHEN RatingDifference BETWEEN -150 AND -101 THEN '-125'
            WHEN RatingDifference BETWEEN -200 AND -151 THEN '-175'
            WHEN RatingDifference BETWEEN -250 AND -201 THEN '-225'
            WHEN RatingDifference BETWEEN -300 AND -251 THEN '-275'
            WHEN RatingDifference BETWEEN -350 AND -301 THEN '-325'
            WHEN RatingDifference BETWEEN -400 AND -351 THEN '-375'
            WHEN RatingDifference BETWEEN -450 AND -401 THEN '-425'
            WHEN RatingDifference BETWEEN -500 AND -451 THEN '-475'
            WHEN RatingDifference BETWEEN -550 AND -501 THEN '-525'
            WHEN RatingDifference BETWEEN -600 AND -551 THEN '-575'

            ELSE 'Other'
        END AS RatingRange,
        PlayerWin
    FROM
        player_match_stats
)

SELECT
    RatingRange,
    ROUND((SUM(CASE WHEN PlayerWin = TRUE THEN 1 ELSE 0 END) * 100.0 / COUNT(*)), 2) AS Winrate
FROM
    rating_ranges
WHERE
    RatingRange != 'Other'
GROUP BY
    RatingRange
ORDER BY
    CAST(RatingRange AS INTEGER) DESC
`

type GetWinRateByRatingDifferenceRow struct {
	Ratingrange string
	Winrate     pgtype.Numeric
}

func (q *Queries) GetWinRateByRatingDifference(ctx context.Context, r pgtype.Numeric) ([]GetWinRateByRatingDifferenceRow, error) {
	rows, err := q.db.Query(ctx, getWinRateByRatingDifference, r)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []GetWinRateByRatingDifferenceRow
	for rows.Next() {
		var i GetWinRateByRatingDifferenceRow
		if err := rows.Scan(&i.Ratingrange, &i.Winrate); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
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
