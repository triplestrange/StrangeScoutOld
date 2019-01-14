package main

import (
	"log"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/labstack/echo"

	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/mysql"

	"github.com/gocarina/gocsv"
)

func submitRun(c echo.Context) error {
	input := apiRun{}
	data := dbRun{}

	// set data from request body
	if err := c.Bind(&input); err != nil {
		return err
	}

	data = APItoDB(input)

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
	data := dbRun{}
	output := apiRun{}

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
	if err := db.Where(&dbRun{Event: c.Param("event"), TeamNumber: uint16(team), MatchNumber: uint8(match)}).First(&data).Error; err != nil {
		// error handling
		if strings.Contains(err.Error(), "record not found") {
			return c.String(404, "This record does not exist in the database.")
		}
		return c.String(500, "The StrangeScout database server returned an unhandled error. Please contact your system adminstrator and provide them with the following: "+err.Error())
	}

	output = DBtoAPI(data)

	if c.Request().Header.Get("Accept") == "application/json" {
		// encode as JSON and return
		return c.JSON(200, output)
	}

	var records = []apiRun{output}
	// create csv string from struct
	csv, err := gocsv.MarshalString(records)
	if err != nil {
		return c.String(500, "Unable to convert response to CSV"+err.Error())
	}

	// get a timestamp
	var time = time.Now().UTC().Format("2006-01-02_15-04-05")

	// set headers and return csv
	c.Response().Header().Set(echo.HeaderContentType, "text/csv")
	c.Response().Header().Set(echo.HeaderContentDisposition, "attachment; filename=event-"+c.Param("event")+"_team-"+c.Param("team")+"_match-"+c.Param("match")+"_"+time+".csv")
	c.Response().WriteHeader(http.StatusOK)
	c.Response().Write([]byte(csv))

	// blank error for the return
	var blankerr error
	return blankerr
}

func dumpDB(c echo.Context) error {
	var data []dbRun
	var output []apiRun

	// connect to DB
	db, err := gorm.Open("mysql", server)
	if err != nil {
		log.Fatal("failed to connect database: " + err.Error())
		return c.String(500, "Failed to connect to the database: "+err.Error())
	}
	defer db.Close()

	// query for list of matches with specified event
	if err := db.Find(&data).Error; err != nil {
		return c.String(500, "The StrangeScout database server returned an unhandled error. Please contact your system adminstrator and provide them with the following: "+err.Error())
	}
	if len(data) == 0 {
		return c.String(404, "No matching records found in the database.")
	}

	for _, v := range data {
		output = append(output, DBtoAPI(v))
	}

	if c.Request().Header.Get("Accept") == "application/json" {
		// encode as JSON and return
		return c.JSON(200, output)
	}

	// create csv string from struct
	csv, err := gocsv.MarshalString(output)
	if err != nil {
		return c.String(500, "Unable to convert response to CSV"+err.Error())
	}

	// get a timestamp
	var time = time.Now().UTC().Format("2006-01-02_15-04-05")

	// set headers and return csv
	c.Response().Header().Set(echo.HeaderContentType, "text/csv")
	c.Response().Header().Set(echo.HeaderContentDisposition, "attachment; filename=strangescout_"+time+".csv")
	c.Response().WriteHeader(http.StatusOK)
	c.Response().Write([]byte(csv))

	// blank error for the return
	var blankerr error
	return blankerr
}

func readEvent(c echo.Context) error {
	var data []dbRun
	var output []apiRun

	// connect to DB
	db, err := gorm.Open("mysql", server)
	if err != nil {
		log.Fatal("failed to connect database: " + err.Error())
		return c.String(500, "Failed to connect to the database: "+err.Error())
	}
	defer db.Close()

	// query for list of matches with specified event
	if err := db.Where(&dbRun{Event: c.Param("event")}).Find(&data).Error; err != nil {
		return c.String(500, "The StrangeScout database server returned an unhandled error. Please contact your system adminstrator and provide them with the following: "+err.Error())
	}
	if len(data) == 0 {
		return c.String(404, "No matching records found in the database.")
	}

	for _, v := range data {
		output = append(output, DBtoAPI(v))
	}

	if c.Request().Header.Get("Accept") == "application/json" {
		// encode as JSON and return
		return c.JSON(200, output)
	}

	// create csv string from struct
	csv, err := gocsv.MarshalString(output)
	if err != nil {
		return c.String(500, "Unable to convert response to CSV"+err.Error())
	}

	// get a timestamp
	var time = time.Now().UTC().Format("2006-01-02_15-04-05")

	// set headers and return csv
	c.Response().Header().Set(echo.HeaderContentType, "text/csv")
	c.Response().Header().Set(echo.HeaderContentDisposition, "attachment; filename=event-"+c.Param("event")+"_"+time+".csv")
	c.Response().WriteHeader(http.StatusOK)
	c.Response().Write([]byte(csv))

	// blank error for the return
	var blankerr error
	return blankerr
}

func readTeam(c echo.Context) error {
	var data []dbRun
	var output []apiRun
	var team, _ = strconv.Atoi(c.Param("team"))

	// connect to DB
	db, err := gorm.Open("mysql", server)
	if err != nil {
		log.Fatal("failed to connect database: " + err.Error())
		return c.String(500, "Failed to connect to the database: "+err.Error())
	}
	defer db.Close()

	// query for list of matches with specified event
	if err := db.Where(&dbRun{TeamNumber: uint16(team)}).Find(&data).Error; err != nil {
		return c.String(500, "The StrangeScout database server returned an unhandled error. Please contact your system adminstrator and provide them with the following: "+err.Error())
	}
	if len(data) == 0 {
		return c.String(404, "No matching records found in the database.")
	}

	for _, v := range data {
		output = append(output, DBtoAPI(v))
	}

	if c.Request().Header.Get("Accept") == "application/json" {
		// encode as JSON and return
		return c.JSON(200, output)
	}

	// create csv string from struct
	csv, err := gocsv.MarshalString(output)
	if err != nil {
		return c.String(500, "Unable to convert response to CSV"+err.Error())
	}

	// get a timestamp
	var time = time.Now().UTC().Format("2006-01-02_15-04-05")

	// set headers and return csv
	c.Response().Header().Set(echo.HeaderContentType, "text/csv")
	c.Response().Header().Set(echo.HeaderContentDisposition, "attachment; filename=team-"+c.Param("team")+"_"+time+".csv")
	c.Response().WriteHeader(http.StatusOK)
	c.Response().Write([]byte(csv))

	// blank error for the return
	var blankerr error
	return blankerr
}

func readMatch(c echo.Context) error {
	var data []dbRun
	var output []apiRun
	var match, _ = strconv.Atoi(c.Param("match"))

	// connect to DB
	db, err := gorm.Open("mysql", server)
	if err != nil {
		log.Fatal("failed to connect database: " + err.Error())
		return c.String(500, "Failed to connect to the database: "+err.Error())
	}
	defer db.Close()

	// query for list of matches with specified event
	if err := db.Where(&dbRun{Event: c.Param("event"), MatchNumber: uint8(match)}).Find(&data).Error; err != nil {
		return c.String(500, "The StrangeScout database server returned an unhandled error. Please contact your system adminstrator and provide them with the following: "+err.Error())
	}
	if len(data) == 0 {
		return c.String(404, "No matching records found in the database.")
	}

	for _, v := range data {
		output = append(output, DBtoAPI(v))
	}

	if c.Request().Header.Get("Accept") == "application/json" {
		// encode as JSON and return
		return c.JSON(200, output)
	}

	// create csv string from struct
	csv, err := gocsv.MarshalString(output)
	if err != nil {
		return c.String(500, "Unable to convert response to CSV"+err.Error())
	}

	// get a timestamp
	var time = time.Now().UTC().Format("2006-01-02_15-04-05")

	// set headers and return csv
	c.Response().Header().Set(echo.HeaderContentType, "text/csv")
	c.Response().Header().Set(echo.HeaderContentDisposition, "attachment; filename=event-"+c.Param("event")+"_match-"+c.Param("match")+"_"+time+".csv")
	c.Response().WriteHeader(http.StatusOK)
	c.Response().Write([]byte(csv))

	// blank error for the return
	var blankerr error
	return blankerr
}

func readTeamRuns(c echo.Context) error {
	var data []dbRun
	var output []apiRun
	var team, _ = strconv.Atoi(c.Param("team"))

	// connect to DB
	db, err := gorm.Open("mysql", server)
	if err != nil {
		log.Fatal("failed to connect database: " + err.Error())
		return c.String(500, "Failed to connect to the database: "+err.Error())
	}
	defer db.Close()

	// query for list of matches with specified event
	if err := db.Where(&dbRun{Event: c.Param("event"), TeamNumber: uint16(team)}).Find(&data).Error; err != nil {
		return c.String(500, "The StrangeScout database server returned an unhandled error. Please contact your system adminstrator and provide them with the following: "+err.Error())
	}
	if len(data) == 0 {
		return c.String(404, "No matching records found in the database.")
	}

	for _, v := range data {
		output = append(output, DBtoAPI(v))
	}

	if c.Request().Header.Get("Accept") == "application/json" {
		// encode as JSON and return
		return c.JSON(200, output)
	}

	// create csv string from struct
	csv, err := gocsv.MarshalString(output)
	if err != nil {
		return c.String(500, "Unable to convert response to CSV"+err.Error())
	}

	// get a timestamp
	var time = time.Now().UTC().Format("2006-01-02_15-04-05")

	// set headers and return csv
	c.Response().Header().Set(echo.HeaderContentType, "text/csv")
	c.Response().Header().Set(echo.HeaderContentDisposition, "attachment; filename=event-"+c.Param("event")+"_team-"+c.Param("team")+"_"+time+".csv")
	c.Response().WriteHeader(http.StatusOK)
	c.Response().Write([]byte(csv))

	// blank error for the return
	var blankerr error
	return blankerr
}
