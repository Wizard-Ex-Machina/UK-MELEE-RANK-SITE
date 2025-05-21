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

func GLOBAL_DATEBASE_URL() (string, error) {
	data := os.Getenv("GLOBAL_DATABASE_URL")
	if data != "" {
		return data, nil
	}
	return "", errors.New("GLOBAL_DATABASE_URL not inculded in env")
}
