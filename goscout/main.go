package main

import (
	"log"
	"net/http"
	"os"
	"strconv"
	"strings"

	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"

	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/mysql"
)

// run struct
type run struct {
	Event                 string `gorm:"type:varchar(100); not null; primary_key"`
	TeamNumber            uint16 `gorm:"type:smallint; not null; primary_key"`
	MatchNumber           uint8  `gorm:"type:smallint; not null; primary_key"`
	StartPosition         string `gorm:"type:varchar(100)"`
	AutoMovementLine      bool   `gorm:"type:boolean"`
	AutoSwitchCubes       uint8  `gorm:"type:tinyint"`
	AutoScaleCubes        uint8  `gorm:"type:tinyint"`
	FailedAutoSwitchCubes uint8  `gorm:"type:tinyint"`
	FailedAutoScaleCubes  uint8  `gorm:"type:tinyint"`
	AutoExchange          uint8  `gorm:"type:tinyint"`
	TeleSwitchCubes       uint8  `gorm:"type:tinyint"`
	TeleScaleCubes        uint8  `gorm:"type:tinyint"`
	FailedTeleSwitchCubes uint8  `gorm:"type:tinyint"`
	FailedTeleScaleCubes  uint8  `gorm:"type:tinyint"`
	TeleExchange          uint8  `gorm:"type:tinyint"`
	EndPosition           string `gorm:"type:varchar(100)"`
	YellowCards           uint8  `gorm:"type:tinyint"`
	RedCards              uint8  `gorm:"type:tinyint"`
	Notes                 string `gorm:"type:text(65535)"`
	Scouter               string `gorm:"type:varchar(100); primary_key"`
	Timestamp             string `gorm:"type:datetime; not null"`
}

var server string

func main() {
	server = os.Getenv("GOSCOUT_SQL_USER") + ":" + os.Getenv("GOSCOUT_SQL_PASSWD") + "@tcp(" + os.Getenv("GOSCOUT_SQL_HOST") + ")/strangescout"
	initDB()
	startAPI()
}

// initialize the database
func initDB() {
	// connect to DB
	db, err := gorm.Open("mysql", server)
	if err != nil {
		log.Fatal("failed to connect database: " + err.Error())
	}
	defer db.Close()

	// apply schema to DB
	db.AutoMigrate(&run{})
}

func startAPI() {
	e := echo.New()

	// Middleware
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	// Routes
	e.GET("/version", version)

	// submission
	e.PUT("/team/:team/match/:match", submitRun)
	e.PUT("/event/:event/team/:team/match/:match", submitRun)

	// run query
	e.GET("/event/:event/team/:team/match/:match", readRun)

	// indexes
	e.GET("/events", getEvents)
	e.GET("/teams", getTeams)

	// event specific indexes
	e.GET("/event/:event/teams", getEventTeams)
	e.GET("/event/:event/team/:team/matches", getTeamMatches)
	e.GET("/event/:event/matches", getEventMatches)

	// team specific indexes
	e.GET("/team/:team/events", getTeamEvents)

	// Start server
	e.Logger.Fatal(e.Start(":15338"))
}

func version(c echo.Context) error {
	// return API version
	return c.String(http.StatusOK, "GoScout API v1.0.0a")
}

func submitRun(c echo.Context) error {
	data := &run{}

	// set data from request body
	if err := c.Bind(data); err != nil {
		return err
	}

	// set data from request URL
	team, _ := strconv.Atoi(c.Param("team"))
	match, _ := strconv.Atoi(c.Param("match"))
	data.TeamNumber = uint16(team)
	data.MatchNumber = uint8(match)

	// if request has an event, set the event
	if c.Param("event") != "" {
		data.Event = c.Param("event")
	} else {
		// use the env variable if the event is not in the URL
		if _, b := os.LookupEnv("GOSCOUT_EVENT_HARDCODE"); b == true {
			data.Event = os.Getenv("GOSCOUT_EVENT_HARDCODE")
		}
	}

	// connect to database
	db, err := gorm.Open("mysql", server)
	if err != nil {
		log.Fatal("failed to connect database: " + err.Error())
		return c.String(500, "Failed to connect to the database: "+err.Error())
	}
	defer db.Close()

	// create record
	if err := db.Create(data).Error; err != nil {
		// error handling
		if strings.Contains(err.Error(), "Error 1062") {
			return c.String(409, "This data duplicated an existing record. If you are trying to submit this data for the first time, your client has generateted multiple requests and your data has been safely recored. If you need to correct or delete previously entered data, please inform your system administrator.")
		}
		return c.String(500, "The StrangeScout database server returned an unhandled error. Please contact your system adminstrator and provide them with the following: "+err.Error())
	}

	return c.String(201, "Data successfully recorded! Thank you for using the StrangeScout system.")
}

func readRun(c echo.Context) error {
	data := &run{}

	// connect to DB
	db, err := gorm.Open("mysql", server)
	if err != nil {
		log.Fatal("failed to connect database: " + err.Error())
		return c.String(500, "Failed to connect to the database: "+err.Error())
	}
	defer db.Close()

	// get team and match from request path
	team, _ := strconv.Atoi(c.Param("team"))
	match, _ := strconv.Atoi(c.Param("match"))

	// query DB
	if err := db.Where(&run{Event: c.Param("event"), TeamNumber: uint16(team), MatchNumber: uint8(match)}).First(&data).Error; err != nil {
		// error handling
		if strings.Contains(err.Error(), "record not found") {
			return c.String(404, "This record does not exist in the database.")
		}
		return c.String(500, "The StrangeScout database server returned an unhandled error. Please contact your system adminstrator and provide them with the following: "+err.Error())
	}

	// return
	return c.JSON(200, data)
}

func getEvents(c echo.Context) error {
	var response []run
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
	var response []run
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
	var response []run
	var teamIndex []int

	// connect to DB
	db, err := gorm.Open("mysql", server)
	if err != nil {
		log.Fatal("failed to connect database: " + err.Error())
		return c.String(500, "Failed to connect to the database: "+err.Error())
	}
	defer db.Close()

	// query for list of teams with specified event
	if err := db.Find(&response).Where(&run{Event: c.Param("event")}).Pluck("team_number", &teamIndex).Error; err != nil {
		return c.String(500, "The StrangeScout database server returned an unhandled error. Please contact your system adminstrator and provide them with the following: "+err.Error())
	}
	if len(teamIndex) == 0 {
		return c.String(404, "No matching records found in the database.")
	}

	return c.JSON(200, RemoveDuplicateInts(teamIndex))
}

func getEventMatches(c echo.Context) error {
	var response []run
	var matchIndex []int

	// connect to DB
	db, err := gorm.Open("mysql", server)
	if err != nil {
		log.Fatal("failed to connect database: " + err.Error())
		return c.String(500, "Failed to connect to the database: "+err.Error())
	}
	defer db.Close()

	// query for list of matches with specified event
	if err := db.Find(&response).Where(&run{Event: c.Param("event")}).Pluck("match_number", &matchIndex).Error; err != nil {
		return c.String(500, "The StrangeScout database server returned an unhandled error. Please contact your system adminstrator and provide them with the following: "+err.Error())
	}
	if len(matchIndex) == 0 {
		return c.String(404, "No matching records found in the database.")
	}

	return c.JSON(200, RemoveDuplicateInts(matchIndex))
}

func getTeamMatches(c echo.Context) error {
	var response []run
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
	if err := db.Find(&response).Where(&run{Event: c.Param("event"), TeamNumber: uint16(team)}).Pluck("match_number", &matchIndex).Error; err != nil {
		return c.String(500, "The StrangeScout database server returned an unhandled error. Please contact your system adminstrator and provide them with the following: "+err.Error())
	}
	if len(matchIndex) == 0 {
		return c.String(404, "No matching records found in the database.")
	}

	return c.JSON(200, RemoveDuplicateInts(matchIndex))
}

func getTeamEvents(c echo.Context) error {
	var response []run
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
	if err := db.Find(&response).Where(&run{TeamNumber: uint16(team)}).Pluck("event", &eventIndex).Error; err != nil {
		return c.String(500, "The StrangeScout database server returned an unhandled error. Please contact your system adminstrator and provide them with the following: "+err.Error())
	}
	if len(eventIndex) == 0 {
		return c.String(404, "No matching records found in the database.")
	}

	return c.JSON(200, RemoveDuplicateStrings(eventIndex))
}

// RemoveDuplicateStrings : removes duplicates from a string slice
func RemoveDuplicateStrings(s []string) []string {
	m := make(map[string]bool)

	// cycle through values + test for unique-ness
	for _, item := range s {
		if _, ok := m[item]; !ok {
			m[item] = true
		}
	}

	// append values to new slice
	var result []string
	for item := range m {
		result = append(result, item)
	}

	return result
}

// RemoveDuplicateInts : removes duplicates from an int slice
func RemoveDuplicateInts(s []int) []int {
	m := make(map[int]bool)

	// cycle through values + test for unique-ness
	for _, item := range s {
		if _, ok := m[item]; !ok {
			m[item] = true
		}
	}

	// append values to new slice
	var result []int
	for item := range m {
		result = append(result, item)
	}

	return result
}
