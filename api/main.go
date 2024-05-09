package main

import (
	"github.com/joho/godotenv"
  "api/internal/startgg"
)

func main() {
	godotenv.Load()
	startgg.GetEvents()
}
