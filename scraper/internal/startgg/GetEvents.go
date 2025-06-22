package startgg

import (
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"scraper/internal/config"
	"strconv"
	"strings"
	"time"
)

type eventRes struct {
	Data struct {
		Tournaments struct {
			Nodes []Tournament `json:"nodes"`
		} `json:"tournaments"`
	} `json:"data"`
}

type Tournament struct {
	Slug         string  `json:"slug"`
	Id           int     `json:"id"`
	Name         string  `json:"name"`
	CountryCode  string  `json:"countryCode"`
	Events       []Event `json:"events"`
	NumAttendees int     `json:"numAttendees"`
	EndAt        int     `json:"endAt"`
	PostalCode   string  `json:"postalCode"`
}

type Event struct {
	Name      string `json:"name"`
	Id        int    `json:"id"`
	Videogame struct {
		Id int `json:"id"`
	} `json:"videogame"`
}

func GetEvents() ([]Tournament, error) {
	pageLength := 1
	token, _ := config.STARTGG_API_TOKEN()
	page := 1
	retries := 0
	tournaments := []Tournament{}
	for pageLength > 0 && page < 10 {

		temp, err := getEventsPage(page, token)
		if err != nil {
			if err.Error() == "429" {
				time.Sleep(5 * time.Second)

			} else {
				fmt.Println(err.Error())
				if retries > 10 {
					page++
					retries = 0
				}
				retries++
			}
		} else {
			tournaments = append(tournaments, temp...)
			pageLength = len(temp)
			println(strconv.Itoa(len(tournaments)))
			page += 1
		}
	}
	return tournaments, nil
}

func getEventsPage(page int, token string) ([]Tournament, error) {
	url := "https://api.start.gg/gql/alpha"

	payload := strings.NewReader("{\"query\":\"query (, $page: Int!) {\\n  tournaments(\\n    query: {page: $page, perPage:  100, filter: {past: true,  videogameIds: [1]} }\\n  ) {\\n    nodes {\\n\\t\\t\\tslug\\n      id\\n      name\\n      countryCode\\n      events {\\n        name\\n        id\\n\\t\\t\\t\\tvideogame {\\n\\t\\t\\t\\t\\tid\\n\\t\\t\\t\\t}\\n      }\\n      numAttendees\\n      endAt\\n      postalCode\\n    }\\n  }\\n}\\n\\n\",\"variables\":{\"page\":" + strconv.Itoa(page) + "}}")

	req, _ := http.NewRequest("POST", url, payload)

	req.Header.Add("Content-Type", "application/json")
	req.Header.Add("Authorization", "Bearer "+token)

	res, err := http.DefaultClient.Do(req)

	if err != nil {

		return nil, err
	}
	defer res.Body.Close()
	if res.StatusCode != http.StatusOK {
		return nil, errors.New(strconv.Itoa(res.StatusCode))
	}
	body, err := io.ReadAll(res.Body)
	if err != nil {
		return nil, err
	}
	var responseObject eventRes
	json.Unmarshal(body, &responseObject)
	return responseObject.Data.Tournaments.Nodes, nil
}
