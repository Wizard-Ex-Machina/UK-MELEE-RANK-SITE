package config

import (
	"os"
)

func STARTGG_API_TOKEN() string {
	return os.Getenv("STARTGG_API_TOKEN")
}

func PORT() string {
	return os.Getenv("PORT")
}

func DATABASE_URL() string {
	return os.Getenv("DATABASE_URL")
}
