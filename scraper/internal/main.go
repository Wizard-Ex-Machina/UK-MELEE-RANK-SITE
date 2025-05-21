package main

import (
	"context"
	"log"
	"scraper/internal/config"

	"github.com/jackc/pgx/v5"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
	"github.com/machinebox/graphql"
)

func main() {
	godotenv.Load()
	ctx := context.Background()
	globalDatebaseURL, err := config.GLOBAL_DATEBASE_URL()
	globalDatabase, err := pgx.Connect(ctx, globalDatebaseURL)
	client := graphql.NewClient("https://api.start.gg/gql/alpha")

	if err != nil {
		log.Fatal(err)
	}
	globalDatabase.Close(ctx)
}
