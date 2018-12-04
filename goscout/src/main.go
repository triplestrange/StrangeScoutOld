package main

import (
	"log"
	"net/http"
	"os"

	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"

	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/mysql"
)

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
	e.Pre(middleware.RemoveTrailingSlash())
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	// Routes
	e.GET("/version", version)

	// submission
	e.PUT("/team/:team/match/:match", submitRun)              // submit using backends coded event
	e.PUT("/event/:event/team/:team/match/:match", submitRun) // submit with a manually set event

	// queries
	e.GET("/dump", dumpDB)                                  // dump whole database}
	e.GET("/event/:event", readEvent)                       // dump whole event
	e.GET("/team/:team", readTeam)                          // dump whole team
	e.GET("/event/:event/match/:match", readMatch)          // whole match at event
	e.GET("/event/:event/team/:team", readTeamRuns)         // whole team at event
	e.GET("/event/:event/team/:team/match/:match", readRun) // single run
	e.GET("/event/:event/match/:match/team/:team", readRun) // single run

	// indexes
	e.GET("/events", getEvents) // all events
	e.GET("/teams", getTeams)   // all teams
	// event specific indexes
	e.GET("/event/:event/teams", getEventTeams)               // all teams at an event
	e.GET("/event/:event/team/:team/matches", getTeamMatches) // all runs a team had at an event
	e.GET("/event/:event/matches", getEventMatches)           // all matches at an event
	// match specific indexes
	e.GET("/event/:event/match/:match/teams", getMatchTeams) // all teams in a match at an event
	// team specific indexes
	e.GET("/team/:team/events", getTeamEvents) // all events a team has records for

	// Start server
	e.Logger.Fatal(e.Start(":15338"))
}

func version(c echo.Context) error {
	// return API version
	return c.String(http.StatusOK, "GoScout API v1.0.0a")
}
