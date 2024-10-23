package scraper

import (
	"api/internal/config"
	"api/internal/postgres"
	"api/internal/startgg"
	"context"
	"fmt"
	"slices"
	"strings"
	"time"
	"trueskill"

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
	game := trueskill.NewDefaultGame()
	queries := postgres.New(db)
	events := startgg.GetEvents()
	for _, tournament := range events {
		dbTournament, err := queries.CreateTournament(ctx, postgres.CreateTournamentParams{Name: tournament.Name, Postcode: pgtype.Text{String: tournament.PostalCode, Valid: true}, Slug: tournament.Slug, EndAt: pgtype.Date{Time: time.Unix(int64(tournament.EndAt), 0), Valid: true}})
		if err != nil {
			fmt.Println(err)
		}

		if err == nil {
			for _, event := range tournament.Events {
				//Filter for only melee singles events
				if event.Videogame.Id == 1 && (slices.Contains([]string{"MELEE", "SINGLES", "SUPER SMASH BROS. MELEE", "SUPER SMASH BROS. MELEE - SINGLES"}, strings.ToUpper(event.Name)) || strings.Contains(strings.ToUpper(event.Name), "MELEE SINGLES")) {
					//Create event in database
					_, err := queries.CreateEvent(ctx, postgres.CreateEventParams{Name: event.Name, TournamentID: dbTournament.TournamentID, StartGgID: int32(event.Id)})
					if err != nil {
						fmt.Println(err)
					} else {
						matches := startgg.GetMatches(event.Id)
						for _, match := range matches {
							if (len(match.Slots[0].Entrant.Participants) + len(match.Slots[1].Entrant.Participants)) == 2 {
								//Get players from database
								//Create New Players if they don't exist
								player1 := GetOrCreatePlayer(ctx, queries, match, tournament, 0)
								player2 := GetOrCreatePlayer(ctx, queries, match, tournament, 1)

								fmt.Println(player1)
								fmt.Println(player2)

								//Process Rating Change
								//Create Match in database
								//Create Match slots in database
							}
						}
					}
				}
			}
		}
	}
	defer db.Close(ctx)

}

func GetOrCreatePlayer(ctx context.Context, queries *postgres.Queries, match startgg.Match, tournament startgg.Tournaments, slot int) postgres.Player {
	player, err := queries.GetPlayerFromAlias(ctx, int32(match.Slots[slot].Entrant.Participants[0].User.Id))
	if err != nil {
		if err.Error() == "no rows in result set" {
			newPlayer, err := queries.CreatePlayer(ctx, postgres.CreatePlayerParams{Name: match.Slots[slot].Entrant.Participants[0].User.Player.GamerTag, FirstAppearance: pgtype.Date{Time: time.Unix(int64(tournament.EndAt), 0), Valid: true}})

			if err != nil {
				fmt.Println(err)
			}
			_, err2 := queries.CreatePlayerAlias(ctx, postgres.CreatePlayerAliasParams{PlayerID: newPlayer.PlayerID, StartGgID: int32(match.Slots[slot].Entrant.Participants[0].User.Id)})
			player = newPlayer
			if err2 != nil {
				fmt.Println(err)
			}
		} else {
			fmt.Println(err)
		}
	}

	return player, rating
}
