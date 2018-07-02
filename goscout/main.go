package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"

	_ "github.com/go-sql-driver/mysql"
	"github.com/gorilla/mux"
)

var server string

func main() {
	server = os.Getenv("GOSCOUT_SQL_USER") + ":" + os.Getenv("GOSCOUT_SQL_PASSWD") + "@tcp(" + os.Getenv("GOSCOUT_SQL_HOST") + ")/strangescout"
	initDB()
	startAPI()
}

type matchScoutData struct {
	Event                 string
	TeamNumber            uint16
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
	Timestamp             string
}

type pitScoutData struct {
	Event              string
	TeamNumber         uint16
	TeamName           string
	TeamLocation       string
	GroundClearance    float32
	DriveTrain         string
	RobotWeight        float32
	LeftStart          bool
	CenterStart        bool
	RightStart         bool
	CubeMech           bool
	GroundIntake       bool
	Climber            bool
	Baseline           bool
	AutonomousSwitch   bool
	AutonomousScale    bool
	AutonomousExchange bool
	TeleopSwitch       bool
	TeleopScale        bool
	TeleopExchange     bool
	Notes              string
	Timestamp          string
}

// this allows us to start with a blank database
func initDB() {

	fmt.Println("Preparing to initialize database...")

	db, err := sql.Open("mysql", server)
	if err != nil {
		log.Fatal(err)
	} else {
		defer db.Close()
	}
	err = db.Ping()
	if err != nil {
		log.Fatal(err)
	}
	_, err = db.Exec("ALTER DATABASE `strangescout`" + `
		DEFAULT CHARACTER SET utf8
		DEFAULT COLLATE utf8_general_ci;`)
	if err != nil {
		log.Fatal(err)
	}

	_, err = db.Exec(`CREATE TABLE IF NOT EXISTS MatchData (
			Event VARCHAR(100) NOT NULL, TeamNumber SMALLINT NOT NULL,
			MatchNumber SMALLINT NOT NULL,
			StartPosition VARCHAR(100),
			AutoMovementLine BOOLEAN,
			AutoSwitchCubes TINYINT,
			AutoScaleCubes TINYINT,
			FailedAutoSwitchCubes TINYINT,
			FailedAutoScaleCubes TINYINT,
			AutoExchange TINYINT,
			TeleSwitchCubes TINYINT,
			TeleScaleCubes TINYINT,
			FailedTeleSwitchCubes TINYINT,
			FailedTeleScaleCubes TINYINT,
			TeleExchange TINYINT,
			EndPosition VARCHAR(100),
			YellowCards TINYINT,
			RedCards TINYINT,
			Notes TEXT(65535),
			Timestamp DATETIME NOT NULL,
			PRIMARY KEY (Event, TeamNumber, MatchNumber));`)

	if err != nil {
		log.Fatal(err)
	}
	_, err = db.Exec(`CREATE TABLE IF NOT EXISTS PitData (
			Event VARCHAR(100) NOT NULL,
			TeamNumber SMALLINT NOT NULL,
			TeamName VARCHAR(1000),
			TeamLocation VARCHAR(1000),
			GroundClearance DOUBLE UNSIGNED,
			DriveTrain VARCHAR(1000),
			RobotWeight DOUBLE UNSIGNED,
			LeftStart BOOLEAN,
			CenterStart BOOLEAN,
			RightStart BOOLEAN,
			CubeMech BOOLEAN,
			GroundIntake BOOLEAN,
			Climber BOOLEAN,
			Baseline BOOLEAN,
			AutonomousSwitch BOOLEAN,
			AutonomousScale BOOLEAN,
			AutonomousExchange BOOLEAN,
			TeleopSwitch BOOLEAN,
			TeleopScale BOOLEAN,
			TeleopExchange BOOLEAN,
			Notes TEXT(65535),
			Timestamp DATETIME NOT NULL,
			PRIMARY KEY (Event, TeamNumber));`)

	if err == nil {
		return
	} else {
		log.Fatal(err)
	}
}

// our main function
func startAPI() {
	//initialize API server and setup endpoints
	router := mux.NewRouter()
	router.HandleFunc("/submitmatch", writeMatch).Methods("POST")
	router.HandleFunc("/submitpit", writePit).Methods("POST")
	http.ListenAndServe(":15338", router)
}

// API Handlers
func writeMatch(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		http.Error(w, http.StatusText(405), 405)
		return
	}

	fmt.Println("Handling POST /submitmatch")

	var data matchScoutData
	_ = json.NewDecoder(r.Body).Decode(&data)

	// now hardcoding is optional and set by environment variable
	if _, b := os.LookupEnv("GOSCOUT_EVENT_HARDCODE"); b == true {
		data.Event = os.Getenv("GOSCOUT_EVENT_HARDCODE")
	}
	fmt.Printf("%+v\n", data)
	// initialize SQL and test connection
	db, err := sql.Open("mysql", server)
	if err != nil {
		log.Panic(err)
	} else {
		defer db.Close()
	}
	err = db.Ping()
	if err != nil {
		log.Panic(err)
	}

	fmt.Println(data.MatchNumber)

	_, err = db.Exec("INSERT INTO MatchData (Event, TeamNumber, MatchNumber, StartPosition, AutoMovementLine, AutoSwitchCubes, AutoScaleCubes, FailedAutoSwitchCubes, FailedAutoScaleCubes, AutoExchange, TeleSwitchCubes, TeleScaleCubes, FailedTeleSwitchCubes, FailedTeleScaleCubes, TeleExchange, EndPosition, YellowCards, RedCards, Notes, Timestamp) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", data.Event, data.TeamNumber, data.MatchNumber, data.StartPosition, data.AutoMovementLine, data.AutoSwitchCubes, data.AutoScaleCubes, data.FailedAutoSwitchCubes, data.FailedAutoScaleCubes, data.AutoExchange, data.TeleSwitchCubes, data.TeleScaleCubes, data.FailedTeleSwitchCubes, data.FailedTeleScaleCubes, data.TeleExchange, data.EndPosition, data.YellowCards, data.RedCards, data.Notes, data.Timestamp)
	if err != nil {
		http.Error(w, http.StatusText(500), 500)
		fmt.Println(err)
		return
	}
}

func writePit(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		http.Error(w, http.StatusText(405), 405)
		return
	}

	fmt.Println("Handling POST /submitpit")

	var data pitScoutData
	_ = json.NewDecoder(r.Body).Decode(&data)
	// now hardcoding is optional and set by environment variable
	if _, b := os.LookupEnv("GOSCOUT_EVENT_HARDCODE"); b == true {
		data.Event = os.Getenv("GOSCOUT_EVENT_HARDCODE")
	}
	fmt.Printf("%+v\n", data)

	// initialize SQL and test connection
	db, err := sql.Open("mysql", server)
	if err != nil {
		log.Fatal(err)
	} else {
		defer db.Close()
	}
	err = db.Ping()
	if err != nil {
		log.Fatal(err)
	}

	_, err = db.Exec("INSERT INTO PitData (Event, TeamNumber, TeamName, TeamLocation, GroundClearance, DriveTrain, RobotWeight, LeftStart, CenterStart, RightStart, CubeMech, GroundIntake, Climber, Baseline, AutonomousSwitch, AutonomousScale, AutonomousExchange, TeleopSwitch, TeleopScale, TeleopExchange, Notes, Timestamp) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", data.Event, data.TeamNumber, data.TeamName, data.TeamLocation, data.GroundClearance, data.DriveTrain, data.RobotWeight, data.LeftStart, data.CenterStart, data.RightStart, data.CubeMech, data.GroundIntake, data.Climber, data.Baseline, data.AutonomousSwitch, data.AutonomousScale, data.AutonomousExchange, data.TeleopSwitch, data.TeleopScale, data.TeleopExchange, data.Notes, data.Timestamp)
	if err != nil {
		http.Error(w, http.StatusText(500), 500)
		fmt.Println(err)
		return
	}
}
