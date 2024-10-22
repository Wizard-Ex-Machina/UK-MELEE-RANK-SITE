package scraper

import (
	"api/internal/config"
	"api/internal/postgres"
	"api/internal/startgg"
	"context"
	"fmt"
	"strconv"
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
			fmt.Println("Fuck:" + tournament.Slug)
		}
		fmt.Println(strconv.FormatInt(int64(dbTournament.TournamentID), 10) + " " + dbTournament.Name)
		// for _, event := range tournement.Events {
		// 	fmt.Println(tournement.Name + " " + event.Name)
		// }
	}
	defer db.Close(ctx)

}
