package main

import (
	"scraper/internal/config"
	"scraper/internal/startgg"

	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

func main() {
	godotenv.Load()
	//globalDatebaseURL, err := config.GLOBAL_DATEBASE_URL()
	token, _ := config.STARTGG_API_TOKEN()
	//globalDatabase, err := pgx.Connect(ctx, globalDatebaseURL)

	startgg.GetMatches(10617, token)

	// if err != nil {
	// 	log.Fatal(err)
	// }
	//globalDatabase.Close(ctx)
}
