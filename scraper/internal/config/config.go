package config

import (
	"errors"
	"os"
)

func STARTGG_API_TOKEN() (string, error) {
	data := os.Getenv("STARTGG_API_TOKEN")
	if data != "" {
		return data, nil
	}
	return "", errors.New("STARTGG_API_TOKEN not inculded in env")
}

func PORT() string {
	return os.Getenv("PORT")
}

func DATABASE_URL() string {
	return os.Getenv("DATABASE_URL")
}
