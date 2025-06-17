package startgg

import (
	"encoding/json"
	"errors"
	"io"
	"net/http"
	"scraper/internal/config"
	"strconv"
	"strings"
	"time"
)

type Response struct {
	Data struct {
		Event struct {
			ID   int    `json:"id"`
			Name string `json:"name"`
			Sets struct {
				Nodes []Set `json:"nodes"`
			} `json:"sets"`
		} `json:"event"`
	} `json:"data"`
}

type Set struct {
	Games []Game `json:"games"`
	Slots []Slot `json:"slots"`
}

type Game struct {
	WinnerID   int         `json:"winnerId"`
	OrderNum   int         `json:"orderNum"`
	Selections []Selection `json:"selections"`
}

type Selection struct {
	Entrant   Entrant   `json:"entrant"`
	Character Character `json:"character"`
}

type Entrant struct {
	ID           int           `json:"id"`
	Participants []Participant `json:"participants"`
}

type Participant struct {
	User User `json:"user"`
}

type User struct {
	ID     int    `json:"id"`
	Player Player `json:"player"`
}

type Player struct {
	GamerTag string `json:"gamerTag"`
}

type Character struct {
	ID int `json:"id"`
}

type Slot struct {
	Entrant  Entrant  `json:"entrant"`
	Standing Standing `json:"standing"`
}

type Standing struct {
	Stats Stats `json:"stats"`
}

type Stats struct {
	Score Score `json:"score"`
}

type Score struct {
	Value int `json:"value"`
}

func GetMatches(eventID int) ([]Set, error) {
	token, _ := config.STARTGG_API_TOKEN()
	pageLength, page, retries := 1, 1, 0
	sets := []Set{}
	for pageLength > 0 {
		setsPage, err := getMatchesPage(eventID, page, token)
		if err == nil {
			sets = append(sets, setsPage...)
			retries = 0
			page++
			pageLength = len(setsPage)
		}
		if err != nil {
			if err.Error() == "429" {
				println(strconv.Itoa(eventID) + " page:" + strconv.Itoa(page) + " matches so far:" + strconv.Itoa(len(sets)) + " hit rate limit waiting 5 secs")
				time.Sleep(time.Second * 5)
			} else {
				println(err.Error())
				println(retries)
				if retries > 10 {
					page++
					retries = 0
				}
				retries++
			}
		}

	}
	return sets, nil
}

func getMatchesPage(eventID int, page int, token string) ([]Set, error) {

	url := "https://api.start.gg/gql/alpha"

	payload := strings.NewReader("{\n  \"query\": \"query ($eventId: ID, $page: Int!) {\\n\\t\\t\\tevent(id: $eventId) {\\n\\t\\t\\t\\tsets(page: $page, perPage: 20, sortType: CALL_ORDER) {\\n\\t\\t\\t\\t\\tnodes {\\n\\t\\t\\t\\t\\t\\tgames {\\n\\t\\t\\t\\t\\t\\t\\twinnerId\\n\\t\\t\\t\\t\\t\\t\\torderNum\\n\\t\\t\\t\\t\\t\\t\\tselections {\\n\\t\\t\\t\\t\\t\\t\\t\\tentrant {\\n\\t\\t\\t\\t\\t\\t\\t\\t\\tid\\n\\t\\t\\t\\t\\t\\t\\t\\t\\tparticipants{\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\tuser{\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\tid\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t}\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t}\\n\\t\\t\\t\\t\\t\\t\\t\\t}\\n\\t\\t\\t\\t\\t\\t\\t\\tcharacter {\\n\\t\\t\\t\\t\\t\\t\\t\\t\\tid\\n\\t\\t\\t\\t\\t\\t\\t\\t}\\n\\t\\t\\t\\t\\t\\t\\t}\\n\\t\\t\\t\\t\\t\\t}\\n\\t\\t\\t\\t\\t\\tslots {\\n\\t\\t\\t\\t\\t\\t\\tentrant {\\n\\t\\t\\t\\t\\t\\t\\t\\tparticipants {\\n\\t\\t\\t\\t\\t\\t\\t\\t\\tuser {\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\tid\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\tplayer {\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\tgamerTag\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t}\\n\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t}\\n\\t\\t\\t\\t\\t\\t\\t\\t}\\n\\t\\t\\t\\t\\t\\t\\t}\\n\\t\\t\\t\\t\\t\\t\\tstanding {\\n\\t\\t\\t\\t\\t\\t\\t\\tstats {\\n\\t\\t\\t\\t\\t\\t\\t\\t\\tscore {\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\tvalue\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t}\\n\\t\\t\\t\\t\\t\\t\\t\\t}\\n\\t\\t\\t\\t\\t\\t\\t}\\n\\t\\t\\t\\t\\t\\t}\\n\\t\\t\\t\\t\\t}\\n\\t\\t\\t\\t}\\n\\t\\t\\t}\\n\\t\\t}\",\n  \"variables\": {\n    \"eventId\": " + strconv.Itoa(eventID) + ",\n    \"page\": " + strconv.Itoa(page) + ",\n    \"perPage\": 20\n  }\n}")

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
	var responseObject Response
	json.Unmarshal(body, &responseObject)
	return responseObject.Data.Event.Sets.Nodes, nil

}
