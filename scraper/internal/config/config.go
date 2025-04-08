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
	return "3001", errors.New("PORT not inculded in env defaulting to 3001")
}

func DATABASE_URL() (string, error) {
	data := os.Getenv("DATABASE_URL")
	if data != "" {
		return data, nil
	}
	return "", errors.New("DATABASE_URL not inculded in env")
}

func REGION_CODE() (string, error) {
	data := os.Getenv("REGION_CODE")
	if data != "" {
		return data, nil
	}
	return "GB", errors.New("REGION_CODE missing from env defaulting to GB")
}

func GLOBAL() (bool, error) {
	data := os.Getenv("REGION_CODE")
	if data == "TRUE" {
		return true, nil
	}
	if data == "FALSE" {
		return false, nil
	}
	return false, errors.New("GLOBAL missing from env defaulting to false")
}
