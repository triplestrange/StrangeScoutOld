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
