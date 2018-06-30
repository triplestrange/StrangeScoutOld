package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	_ "github.com/go-sql-driver/mysql"
	"github.com/gorilla/mux"
)

var server string

func main() {
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

// our main function
func startAPI() {
	//initialize API server and setup endpoints
	router := mux.NewRouter()
	router.HandleFunc("/submitmatch", writeMatch).Methods("POST")
	router.HandleFunc("/submitpit", writePit).Methods("POST")
	http.ListenAndServe("127.0.0.1:15338", router)
}

// API Handlers
func writeMatch(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		http.Error(w, http.StatusText(405), 405)
		return
	}

	var data matchScoutData
	_ = json.NewDecoder(r.Body).Decode(&data)
	data.Event = "2018turing"
	fmt.Printf("%+v\n", data)

	// initialize SQL and test connection
	rds, err := sql.Open("mysql", server)
	if err != nil {
		log.Fatal(err)
	} else {
		defer rds.Close()
	}
	err = rds.Ping()
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println(data.MatchNumber)

	_, err = rds.Exec("INSERT INTO MatchData (Event, TeamNumber, MatchNumber, StartPosition, AutoMovementLine, AutoSwitchCubes, AutoScaleCubes, FailedAutoSwitchCubes, FailedAutoScaleCubes, AutoExchange, TeleSwitchCubes, TeleScaleCubes, FailedTeleSwitchCubes, FailedTeleScaleCubes, TeleExchange, EndPosition, YellowCards, RedCards, Notes, Timestamp) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", data.Event, data.TeamNumber, data.MatchNumber, data.StartPosition, data.AutoMovementLine, data.AutoSwitchCubes, data.AutoScaleCubes, data.FailedAutoSwitchCubes, data.FailedAutoScaleCubes, data.AutoExchange, data.TeleSwitchCubes, data.TeleScaleCubes, data.FailedTeleSwitchCubes, data.FailedTeleScaleCubes, data.TeleExchange, data.EndPosition, data.YellowCards, data.RedCards, data.Notes, data.Timestamp)
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

	var data pitScoutData
	_ = json.NewDecoder(r.Body).Decode(&data)
	data.Event = "2018turning"
	fmt.Printf("%+v\n", data)

	// initialize SQL and test connection
	rds, err := sql.Open("mysql",
		"awsuser:$tran6e$c%ut@tcp(strangescout.cd1niyuzf8s7.us-east-1.rds.amazonaws.com)/strangescout")
	if err != nil {
		log.Fatal(err)
	} else {
		defer rds.Close()
	}
	err = rds.Ping()
	if err != nil {
		log.Fatal(err)
	}

	_, err = rds.Exec("INSERT INTO PitData (Event, TeamNumber, TeamName, TeamLocation, GroundClearance, DriveTrain, RobotWeight, LeftStart, CenterStart, RightStart, CubeMech, GroundIntake, Climber, Baseline, AutonomousSwitch, AutonomousScale, AutonomousExchange, TeleopSwitch, TeleopScale, TeleopExchange, Notes, Timestamp) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", data.Event, data.TeamNumber, data.TeamName, data.TeamLocation, data.GroundClearance, data.DriveTrain, data.RobotWeight, data.LeftStart, data.CenterStart, data.RightStart, data.CubeMech, data.GroundIntake, data.Climber, data.Baseline, data.AutonomousSwitch, data.AutonomousScale, data.AutonomousExchange, data.TeleopSwitch, data.TeleopScale, data.TeleopExchange, data.Notes, data.Timestamp)
	if err != nil {
		http.Error(w, http.StatusText(500), 500)
		fmt.Println(err)
		return
	}
}
