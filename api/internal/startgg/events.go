package startgg

import (
	"api/internal/config"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/gosuri/uilive"
)

type eventRes struct {
	Data struct {
		Tournaments struct {
			Nodes []Tournaments `json:"nodes"`
		} `json:"tournaments"`
	} `json:"data"`
}

type Tournaments struct {
	Slug        string `json:"slug"`
	Id          int    `json:"id"`
	Name        string `json:"name"`
	CountryCode string `json:"countryCode"`
	Events      []struct {
		Name      string `json:"name"`
		Id        int    `json:"id"`
		Videogame struct {
			Id int `json:"id"`
		} `json:"videogame"`
	} `json:"events"`
	NumAttendees int    `json:"numAttendees"`
	EndAt        int    `json:"endAt"`
	PostalCode   string `json:"postalCode"`
}

func logProgress(line1 *uilive.Writer, totalProgress float64, event string, found string) {
	_, _ = fmt.Fprintf(line1, "Fetching Events: %s\n", event)
	_, _ = fmt.Fprintf(line1, "Total Events: %s\n", found)
	bar := progressbar(100, totalProgress)
	_, _ = fmt.Fprintf(line1.Newline(), "Total Progress: %s\n", bar)
}
func progressbar(width int, percent float64) string {
	n := int(float64(width) * percent)
	return "[" + strings.Repeat("#", n) + strings.Repeat(" ", width-n) + "]"
}

func GetEvents(startDate time.Time) []Tournaments {
	pageLength := 80
	page := 1
	before := startDate
	writer := uilive.New()
	writer.Start()

	tournaments := []Tournaments{}
	for before.Unix() < time.Now().AddDate(-7, 0, 0).Unix() {
		logProgress(writer, float64(before.Unix()-startDate.Unix())/float64(time.Now().Unix()-startDate.Unix()), before.Format("2006-01-02"), strconv.Itoa(len(tournaments)))
		for pageLength >= 80 {
			time.Sleep(time.Second * 7 / 10)
			temp := getEventsPage(page, before)
			tournaments = append(tournaments, temp.Data.Tournaments.Nodes...)
			pageLength = len(temp.Data.Tournaments.Nodes)
			page += 1
		}
		pageLength = 80
		page = 1
		before = before.AddDate(0, 3, 0)
	}
	return tournaments
}

func getEventsPage(page int, before time.Time) eventRes {
	url := "https://api.start.gg/gql/alpha"

	payload := strings.NewReader("{\n  \"query\": \"query (, $page: Int!) {\\n  tournaments(\\n    query: {page: $page, perPage:  80, filter: {past: true, videogameIds: [1], beforeDate: " + strconv.FormatInt(before.AddDate(0, 3, 0).Unix(), 10) + ", afterDate: " + strconv.FormatInt(before.Unix(), 10) + "} }\\n  ) {\\n    nodes {\\n\\t\\t\\tslug\\n      id\\n      name\\n      countryCode\\n      events {\\n        name\\n        id\\n\\t\\t\\t\\tvideogame {\\n\\t\\t\\t\\t\\tid\\n\\t\\t\\t\\t}\\n      }\\n      numAttendees\\n      endAt\\n      postalCode\\n    }\\n  }\\n}\\n\\n\",\n  \"variables\": {\n    \"page\": " + strconv.Itoa(page) + "\n  }\n}")

	req, _ := http.NewRequest("POST", url, payload)

	req.Header.Add("Content-Type", "application/json")
	req.Header.Add("Authorization", "Bearer "+config.STARTGG_API_TOKEN())

	res, err := http.DefaultClient.Do(req)

	defer res.Body.Close()
	responseData, err := io.ReadAll(res.Body)
	if err != nil {
		log.Fatal(err)
	}
	var responseObject eventRes
	json.Unmarshal(responseData, &responseObject)
	return responseObject
}
