package scraper

import (
	"api/internal/config"
	"api/internal/postgres"
	"api/internal/startgg"
	"cmp"
	"context"
	"fmt"
	"slices"
	"strings"
	"time"

	glicko "github.com/ShewkShewk/go-glicko2"
	"github.com/gosuri/uilive"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgtype"
	_ "github.com/lib/pq"
)

func Scraper() {
	ctx := context.Background()
	db, err := pgx.Connect(ctx, config.DATABASE_URL())
	if err != nil {
		fmt.Println(err)
	}
	writer := uilive.New()
	writer.Start()
	fmt.Fprint(writer.Bypass(), "fetching events")

	queries := postgres.New(db)
	events := startgg.GetEvents()
	slices.SortFunc(events, func(a, b startgg.Tournaments) int {
		return cmp.Compare(a.EndAt, b.EndAt)
	})

	// get most recent tournament
	// filter for only new events
	dbMostRecent, err := queries.GetMostRecentTournament(ctx)

	for i, tournament := range events {
		if dbMostRecent.EndAt.Time.Unix() < int64(tournament.EndAt) {
			dbTournament, err := queries.CreateTournament(ctx, postgres.CreateTournamentParams{Name: tournament.Name, Postcode: pgtype.Text{String: tournament.PostalCode, Valid: true},
				CountryCode: tournament.CountryCode,
				Slug:        tournament.Slug, EndAt: pgtype.Date{Time: time.Unix(int64(tournament.EndAt), 0), Valid: true}})

			if err == nil {
				for _, event := range tournament.Events {
					//Filter for only melee singles events
					if event.Videogame.Id == 1 && (slices.Contains([]string{"MELEE", "SINGLES", "SUPER SMASH BROS. MELEE", "SUPER SMASH BROS. MELEE - SINGLES"}, strings.ToUpper(event.Name)) || strings.Contains(strings.ToUpper(event.Name), "MELEE SINGLES")) {
						//Create event in database
						dbEvent, err := queries.CreateEvent(ctx, postgres.CreateEventParams{Name: event.Name, TournamentID: dbTournament.TournamentID, StartGgID: int32(event.Id)})
						if err == nil {
							logProgress(writer, float64(i)/float64(len(events)), tournament.Name)
							matches := startgg.GetMatches(event.Id)
							for _, match := range matches {
								if MatchConditions(match) {

									//Get players from database
									//Create New Players if they don't exist
									player1, glickoPlayer1 := GetOrCreatePlayer(ctx, queries, match, tournament, 0)
									player2, glickoPlayer2 := GetOrCreatePlayer(ctx, queries, match, tournament, 1)
									oldRating1 := glickoPlayer1.Rating().R()
									oldRating2 := glickoPlayer2.Rating().R()
									ratingPeriod := glicko.NewRatingPeriod()
									ratingPeriod.AddPlayer(glickoPlayer1)
									ratingPeriod.AddPlayer(glickoPlayer2)
									for i := 0; i < match.Slots[0].Standing.Stats.Score.Value; i++ {
										ratingPeriod.AddMatch(glickoPlayer1, glickoPlayer2, 1)
									}
									for i := 0; i < match.Slots[1].Standing.Stats.Score.Value; i++ {
										ratingPeriod.AddMatch(glickoPlayer2, glickoPlayer1, 1)
									}
									ratingPeriod.Calculate()

									dbMatch, _ := queries.CreateMatch(ctx, dbEvent.EventID)

									_, err := SaveMatchSlot(ctx, queries, match.Slots[0].Standing.Stats.Score.Value, match.Slots[0].Standing.Stats.Score.Value > match.Slots[1].Standing.Stats.Score.Value, player1, glickoPlayer1, dbMatch, oldRating1)
									_, err2 := SaveMatchSlot(ctx, queries, match.Slots[1].Standing.Stats.Score.Value, match.Slots[1].Standing.Stats.Score.Value > match.Slots[0].Standing.Stats.Score.Value, player2, glickoPlayer2, dbMatch, oldRating2)
									if err != nil || err2 != nil {
									}

									if len(match.Games) > 0 {
										for _, game := range match.Games {
											// queries.CreateGameData(ctx, postgres.CreateGameDataParams{
											// 	MatchID:     dbMatch.MatchID,
											// 	PlayerID:    0,
											// 	GameNumber:  int32(i),
											// 	Win:         pgtype.Bool{Bool: true},
											// 	PreRating:   ConvertFloatToPgtypeNumeric(oldRating1),
											// 	CharacterID: pgtype.Int4{Int32: int32(game.Selections[0].Character.Id)},
											// })
											// changes
											println(game)
										}

									}
								}
								// get placements from event

								placements := startgg.GetPlacements(event.Id)
								for _, placement := range placements {
									player, _ := queries.GetPlayerFromAlias(ctx, int32(placement.Entrant.Particpants[0].User.Id))
									queries.CreatePlacement(ctx, postgres.CreatePlacementParams{PlayerID: player.PlayerID, EventID: dbEvent.EventID, Placement: int32(placement.Placement)})

								}
							}
						}
					}
				}
			}
		}
	}
	defer db.Close(ctx)
	writer.Stop()
}

func logProgress(line1 *uilive.Writer, totalProgress float64, event string) {
	_, _ = fmt.Fprintf(line1, "Processing Events: %s\n", event)
	bar := progressbar(100, totalProgress)
	_, _ = fmt.Fprintf(line1.Newline(), "Total Progress: %s\n", bar)
}
func progressbar(width int, percent float64) string {
	n := int(float64(width) * percent)
	return "[" + strings.Repeat("#", n) + strings.Repeat(" ", width-n) + "]"
}
func MatchConditions(match startgg.Match) bool {
	if !(len(match.Slots[0].Entrant.Participants)+len(match.Slots[1].Entrant.Participants) == 2) {
		return false
	}
	if match.Slots[0].Standing.Stats.Score.Value == -1 {
		return false
	}
	if match.Slots[1].Standing.Stats.Score.Value == -1 {
		return false
	}
	if match.Slots[0].Entrant.Participants[0].User.Id == match.Slots[1].Entrant.Participants[0].User.Id {
		return false
	}
	if match.Slots[0].Entrant.Participants[0].User.Id == 0 {
		return false
	}
	if match.Slots[1].Entrant.Participants[0].User.Id == 0 {
		return false
	}
	if match.Slots[0].Standing.Stats.Score.Value == 0 && match.Slots[1].Standing.Stats.Score.Value == 0 {
		return false
	}
	if match.Slots[0].Entrant.Participants[0].User.Player.GamerTag == "" {
		return false
	}
	if match.Slots[1].Entrant.Participants[0].User.Player.GamerTag == "" {
		return false
	}
	return true
}

func SaveMatchSlot(ctx context.Context, queries *postgres.Queries, score int, win bool, player postgres.Player, rating *glicko.Player, match postgres.Match, oldRating float64) (postgres.MatchSlot, error) {
	wait, err := queries.CreateMatchSlot(ctx, postgres.CreateMatchSlotParams{MatchID: match.MatchID, PlayerID: player.PlayerID, Score: int32(score), Win: win, R: ConvertFloatToPgtypeNumeric(rating.Rating().R()), Rd: ConvertFloatToPgtypeNumeric(rating.Rating().Rd()), Sigma: ConvertFloatToPgtypeNumeric(rating.Rating().Sigma()), Delta: ConvertFloatToPgtypeNumeric(rating.Rating().R() - oldRating)})
	if err != nil {
		return wait, err
	}
	return wait, nil
}

func ConvertFloatToPgtypeNumeric(f float64) pgtype.Numeric {
	var e pgtype.Numeric
	e.Scan(fmt.Sprintf("%f", f))
	return e
}
func GetOrCreatePlayer(ctx context.Context, queries *postgres.Queries, match startgg.Match, tournament startgg.Tournaments, slot int) (postgres.Player, *glicko.Player) {
	player, err := queries.GetPlayerFromAlias(ctx, int32(match.Slots[slot].Entrant.Participants[0].User.Id))
	if err != nil {
		if err.Error() == "no rows in result set" {
			newPlayer, _ := queries.CreatePlayer(ctx, postgres.CreatePlayerParams{Name: match.Slots[slot].Entrant.Participants[0].User.Player.GamerTag, FirstAppearance: pgtype.Date{Time: time.Unix(int64(tournament.EndAt), 0), Valid: true}})

			queries.CreatePlayerAlias(ctx, postgres.CreatePlayerAliasParams{PlayerID: newPlayer.PlayerID, StartGgID: int32(match.Slots[slot].Entrant.Participants[0].User.Id)})

			player = newPlayer
			playerRating := glicko.NewPlayer(glicko.NewRating(float64(2500), float64(300), float64(0.05)))
			return player, playerRating
		} else {
		}
	}
	//Get Players most recent match
	mostRecentMatch, _ := queries.GetRating(ctx, player.PlayerID)
	if err != nil {
		if err.Error() == "no rows in result set" {
			playerRating := glicko.NewPlayer(glicko.NewRating(float64(2500), float64(300), float64(0.05)))
			return player, playerRating
		}
	}
	r, _ := mostRecentMatch.R.Float64Value()
	rd, _ := mostRecentMatch.Rd.Float64Value()
	sigma, _ := mostRecentMatch.Sigma.Float64Value()
	if r.Float64 == 0 || rd.Float64 == 0 || sigma.Float64 == 0 {
		glickoPlayer := glicko.NewPlayer(glicko.NewRating(float64(2500), float64(300), float64(0.05)))
		return player, glickoPlayer
	} else {
		glickoPlayer := glicko.NewPlayer(glicko.NewRating(r.Float64, rd.Float64, sigma.Float64))
		return player, glickoPlayer
	}
	// glickoPlayer := glicko.NewPlayer(glicko.NewDefaultRating())
}
