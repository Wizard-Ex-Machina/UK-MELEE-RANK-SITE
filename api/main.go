package main

import (
	"api/internal/scraper"

	"github.com/joho/godotenv"
)

func main() {
	godotenv.Load()
	scraper.Scraper()
}
