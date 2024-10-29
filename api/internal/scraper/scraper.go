package scraper

import (
	"api/internal/config"
	"api/internal/postgres"
	"api/internal/startgg"
	"cmp"
	"context"
	"fmt"
	"log"
	"slices"
	"strconv"
	"strings"
	"time"

	glicko "github.com/ShewkShewk/go-glicko2"
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
	println("fetching events")

	queries := postgres.New(db)
	events := startgg.GetEvents()
	println("processing events")
	slices.SortFunc(events, func(a, b startgg.Tournaments) int {
		return cmp.Compare(a.EndAt, b.EndAt)
	})

	// get most recent tournament
	// filter for only new events
	dbMostRecent, err := queries.GetMostRecentTournament(ctx)

	for i, tournament := range events {
		if dbMostRecent.EndAt.Time.Unix() < int64(tournament.EndAt) {
			dbTournament, err := queries.CreateTournament(ctx, postgres.CreateTournamentParams{Name: tournament.Name, Postcode: pgtype.Text{String: tournament.PostalCode, Valid: true}, Slug: tournament.Slug, EndAt: pgtype.Date{Time: time.Unix(int64(tournament.EndAt), 0), Valid: true}})
			if err != nil {
				fmt.Println(err)
			}

			if err == nil {
				for _, event := range tournament.Events {
					//Filter for only melee singles events
					if event.Videogame.Id == 1 && (slices.Contains([]string{"MELEE", "SINGLES", "SUPER SMASH BROS. MELEE", "SUPER SMASH BROS. MELEE - SINGLES"}, strings.ToUpper(event.Name)) || strings.Contains(strings.ToUpper(event.Name), "MELEE SINGLES")) {
						//Create event in database
						dbEvent, err := queries.CreateEvent(ctx, postgres.CreateEventParams{Name: event.Name, TournamentID: dbTournament.TournamentID, StartGgID: int32(event.Id)})
						if err != nil {
							fmt.Println(err)
						} else {
							matches := startgg.GetMatches(event.Id)

							fmt.Println(strconv.Itoa(i) + "/" + strconv.Itoa(len(events)) + "	" + tournament.Name + ":" + strconv.Itoa(len(matches)))
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
										log.Println(err)
									}
								}
							}
						}
					}
				}
			}
		}
	}
	defer db.Close(ctx)

}

func MatchConditions(match startgg.Match) bool {
	return (len(match.Slots[0].Entrant.Participants)+len(match.Slots[1].Entrant.Participants)) == 2 && match.Slots[1].Standing.Stats.Score.Value != -1 && match.Slots[0].Standing.Stats.Score.Value != -1
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
			fmt.Println(err)
		}
	}
	//Get Players most recent match
	mostRecentMatch, _ := queries.GetRating(ctx, player.PlayerID)

	r, _ := mostRecentMatch.R.Float64Value()
	rd, _ := mostRecentMatch.Rd.Float64Value()
	sigma, _ := mostRecentMatch.Sigma.Float64Value()
	glickoPlayer := glicko.NewPlayer(glicko.NewRating(r.Float64, rd.Float64, sigma.Float64))
	// glickoPlayer := glicko.NewPlayer(glicko.NewDefaultRating())

	return player, glickoPlayer
}
