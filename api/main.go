package main

import (
	"github.com/joho/godotenv"
  "api/internal/scraper"
)

func main() {
	godotenv.Load()
	scraper.Scraper()
}
