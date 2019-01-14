package main

import (
	"log"
	"strconv"

	"github.com/labstack/echo"

	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/mysql"
)

func getEvents(c echo.Context) error {
	var response []dbRun
	var eventIndex []string

	// connect to DB
	db, err := gorm.Open("mysql", server)
	if err != nil {
		log.Fatal("failed to connect database: " + err.Error())
		return c.String(500, "Failed to connect to the database: "+err.Error())
	}
	defer db.Close()

	// query for list of events
	if err := db.Find(&response).Pluck("event", &eventIndex).Error; err != nil {
		return c.String(500, "The StrangeScout database server returned an unhandled error. Please contact your system adminstrator and provide them with the following: "+err.Error())
	}
	if len(eventIndex) == 0 {
		return c.String(404, "No matching records found in the database.")
	}

	return c.JSON(200, RemoveDuplicateStrings(eventIndex))
}

func getTeams(c echo.Context) error {
	var response []dbRun
	var teamIndex []int

	// connect to DB
	db, err := gorm.Open("mysql", server)
	if err != nil {
		log.Fatal("failed to connect database: " + err.Error())
		return c.String(500, "Failed to connect to the database: "+err.Error())
	}
	defer db.Close()

	// query for list of teams
	if err := db.Find(&response).Pluck("team_number", &teamIndex).Error; err != nil {
		return c.String(500, "The StrangeScout database server returned an unhandled error. Please contact your system adminstrator and provide them with the following: "+err.Error())
	}
	if len(teamIndex) == 0 {
		return c.String(404, "No matching records found in the database.")
	}

	return c.JSON(200, RemoveDuplicateInts(teamIndex))
}

func getEventTeams(c echo.Context) error {
	var response []dbRun
	var teamIndex []int

	// connect to DB
	db, err := gorm.Open("mysql", server)
	if err != nil {
		log.Fatal("failed to connect database: " + err.Error())
		return c.String(500, "Failed to connect to the database: "+err.Error())
	}
	defer db.Close()

	// query for list of teams with specified event
	if err := db.Find(&response).Where(&dbRun{Event: c.Param("event")}).Pluck("team_number", &teamIndex).Error; err != nil {
		return c.String(500, "The StrangeScout database server returned an unhandled error. Please contact your system adminstrator and provide them with the following: "+err.Error())
	}
	if len(teamIndex) == 0 {
		return c.String(404, "No matching records found in the database.")
	}

	return c.JSON(200, RemoveDuplicateInts(teamIndex))
}

func getMatchTeams(c echo.Context) error {
	var response []dbRun
	var teamIndex []int
	var match, _ = strconv.Atoi(c.Param("match"))

	// connect to DB
	db, err := gorm.Open("mysql", server)
	if err != nil {
		log.Fatal("failed to connect database: " + err.Error())
		return c.String(500, "Failed to connect to the database: "+err.Error())
	}
	defer db.Close()

	// query for list of teams with specified event
	if err := db.Find(&response).Where(&dbRun{MatchNumber: uint8(match)}).Pluck("team_number", &teamIndex).Error; err != nil {
		return c.String(500, "The StrangeScout database server returned an unhandled error. Please contact your system adminstrator and provide them with the following: "+err.Error())
	}
	if len(teamIndex) == 0 {
		return c.String(404, "No matching records found in the database.")
	}

	return c.JSON(200, RemoveDuplicateInts(teamIndex))
}

func getEventMatches(c echo.Context) error {
	var response []dbRun
	var matchIndex []int

	// connect to DB
	db, err := gorm.Open("mysql", server)
	if err != nil {
		log.Fatal("failed to connect database: " + err.Error())
		return c.String(500, "Failed to connect to the database: "+err.Error())
	}
	defer db.Close()

	// query for list of matches with specified event
	if err := db.Find(&response).Where(&dbRun{Event: c.Param("event")}).Pluck("match_number", &matchIndex).Error; err != nil {
		return c.String(500, "The StrangeScout database server returned an unhandled error. Please contact your system adminstrator and provide them with the following: "+err.Error())
	}
	if len(matchIndex) == 0 {
		return c.String(404, "No matching records found in the database.")
	}

	return c.JSON(200, RemoveDuplicateInts(matchIndex))
}

func getTeamMatches(c echo.Context) error {
	var response []dbRun
	var matchIndex []int
	var team, _ = strconv.Atoi(c.Param("team"))

	// connect to DB
	db, err := gorm.Open("mysql", server)
	if err != nil {
		log.Fatal("failed to connect database: " + err.Error())
		return c.String(500, "Failed to connect to the database: "+err.Error())
	}
	defer db.Close()

	// query for list of matches with specified event
	if err := db.Find(&response).Where(&dbRun{Event: c.Param("event"), TeamNumber: uint16(team)}).Pluck("match_number", &matchIndex).Error; err != nil {
		return c.String(500, "The StrangeScout database server returned an unhandled error. Please contact your system adminstrator and provide them with the following: "+err.Error())
	}
	if len(matchIndex) == 0 {
		return c.String(404, "No matching records found in the database.")
	}

	return c.JSON(200, RemoveDuplicateInts(matchIndex))
}

func getTeamEvents(c echo.Context) error {
	var response []dbRun
	var eventIndex []string
	var team, _ = strconv.Atoi(c.Param("team"))

	// connect to DB
	db, err := gorm.Open("mysql", server)
	if err != nil {
		log.Fatal("failed to connect database: " + err.Error())
		return c.String(500, "Failed to connect to the database: "+err.Error())
	}
	defer db.Close()

	// query for list of events
	if err := db.Find(&response).Where(&dbRun{TeamNumber: uint16(team)}).Pluck("event", &eventIndex).Error; err != nil {
		return c.String(500, "The StrangeScout database server returned an unhandled error. Please contact your system adminstrator and provide them with the following: "+err.Error())
	}
	if len(eventIndex) == 0 {
		return c.String(404, "No matching records found in the database.")
	}

	return c.JSON(200, RemoveDuplicateStrings(eventIndex))
}
