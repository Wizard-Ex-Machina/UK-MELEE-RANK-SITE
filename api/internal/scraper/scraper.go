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

	queries := postgres.New(db)
	events := startgg.GetEvents()
	for _, tournament := range events {
		dbTournament, err := queries.CreateTournament(ctx, postgres.CreateTournamentParams{Name: tournament.Name, Postcode: pgtype.Text{String: tournament.PostalCode, Valid: true}, Slug: tournament.Slug, EndAt: pgtype.Date{Time: time.Unix(int64(tournament.EndAt), 0), Valid: true}})
		if err != nil {
			fmt.Println(err)
		}

		if err == nil {
			for _, event := range tournament.Events {
				if event.Videogame.Id == 1 && (slices.Contains([]string{"MELEE", "SINGLES", "SUPER SMASH BROS. MELEE", "SUPER SMASH BROS. MELEE - SINGLES"}, strings.ToUpper(event.Name)) || strings.Contains(strings.ToUpper(event.Name), "MELEE SINGLES")) {
					_, err := queries.CreateEvent(ctx, postgres.CreateEventParams{Name: event.Name, TournamentID: dbTournament.TournamentID, StartGgID: int32(event.Id)})
					if err != nil {
						fmt.Println(err)
						fmt.Println(tournament.Name, event.Name)
					}
				}
			}
		}
	}
	defer db.Close(ctx)

}
