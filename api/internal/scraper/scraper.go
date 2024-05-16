package scraper

import (
	"fmt"
	"api/internal/startgg"
)

func Scraper(){
	events := startgg.GetEvents()
	for _, tournement := range events {
		for _,  event := range tournement.Events {
			fmt.Println(tournement.Name +" "+ event.Name)
		}
	}
}
