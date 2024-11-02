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
WHERE
    ms.player_id = $1
ORDER BY
    ms.match_id DESC
LIMIT 1
FOR UPDATE;

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

-- name: CurrentLeaderboard :many
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
    rp.Rank;



-- name: LastWeekLeaderboard :many
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
    Rank;


-- name: GetRatingHistory :many
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
    e.event_id;


-- name: GetOpponentRecords :many
-- Get the win-loss-draw record against each opponent for the specified player
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
    olr.OpponentRating DESC;


-- name: GetMatchHistory :many
-- Get the match history for the specified player
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
LIMIT 250;
