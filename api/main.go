package main

import (
	"github.com/joho/godotenv"
  "api/internal/startgg"
  "fmt"
)

func main() {
	godotenv.Load()
	fmt.Print(startgg.GetMatches(14659))
}
