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

func PORT() (string, error) {
	data := os.Getenv("PORT")
	if data != "" {
		return data, nil
	}
	return "", errors.New("PORT not inculded in env")
}

func DATABASE_URL() (string, error) {
	data := os.Getenv("DATABASE_URL")
	if data != "" {
		return data, nil
	}
	return "", errors.New("DATABASE_URL not inculded in env")
}
