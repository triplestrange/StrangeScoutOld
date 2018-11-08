package main

import (
	"net/http"
	"os"
	"strconv"
	"strings"

	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"

	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/sqlite"
)

// run struct
type run struct {
	Event                 string
	TeamNumber            uint16 `gorm:"primary_key"`
	MatchNumber           uint8
	StartPosition         string
	AutoMovementLine      bool
	AutoSwitchCubes       uint8
	AutoScaleCubes        uint8
	FailedAutoSwitchCubes uint8
	FailedAutoScaleCubes  uint8
	AutoExchange          uint8
	TeleSwitchCubes       uint8
	TeleScaleCubes        uint8
	FailedTeleSwitchCubes uint8
	FailedTeleScaleCubes  uint8
	TeleExchange          uint8
	EndPosition           string
	YellowCards           uint8
	RedCards              uint8
	Notes                 string
	Scouter               string
	Timestamp             string
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
	db, err := gorm.Open("sqlite3", "test.db")
	if err != nil {
		panic("failed to connect database")
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
	e.PUT("/:event/:team/:match", submitRun)

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
	data.Event = c.Param("event")

	// connect to database
	db, err := gorm.Open("sqlite3", "test.db")
	if err != nil {
		panic("failed to connect database")
	}
	defer db.Close()

	// create record
	if err := db.Create(data).Error; err != nil {
		// error handling
		if strings.Contains(err.Error(), "UNIQUE constraint failed") {
			return c.String(409, "This data duplicated an existing record. If you are trying to submit this data for the first time, your client has generateted multiple requests and your data has been safely recored. If you need to correct or delete previously entered data, please inform your system administrator.")
		}
		return c.String(500, "The StrangeScout database server returned an unhandled error. Please contact your system adminstrator and provide them with the following: "+err.Error())
	}

	return c.String(201, "Data successfully recorded! Thank you for using the StrangeScout system.")
}
