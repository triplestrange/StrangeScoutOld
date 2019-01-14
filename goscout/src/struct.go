package main

import (
	"encoding/json"

	"github.com/ulule/deepcopier"
)

// run struct
type dbRun struct {
	Event         string `gorm:"type:varchar(100); not null; primary_key"`
	TeamNumber    uint16 `gorm:"type:smallint; not null; primary_key"`
	MatchNumber   uint8  `gorm:"type:smallint; not null; primary_key"`
	StartPosition string `gorm:"type:varchar(100)"`
	Journal       string `gorm:"type:json" deepcopier:"skip"`
	Notes         string `gorm:"type:text(65535)"`
	Scouter       string `gorm:"type:varchar(100); primary_key"`
	Timestamp     uint64 `gorm:"type:bigint; not null"`
}
type apiRun struct {
	Event         string
	TeamNumber    uint16
	MatchNumber   uint8
	StartPosition string
	Journal       []journalEntry `deepcopier:"skip"`
	Notes         string
	Scouter       string
	Timestamp     uint64
}

type journalEntry struct {
	Time  uint16
	Event string
}

// APItoDB : Converts an API style struct to a DB style struct
func APItoDB(run apiRun) dbRun {
	var out dbRun

	deepcopier.Copy(run).To(out)

	journal, _ := json.Marshal(run.Journal)
	out.Journal = string(journal)

	return out
}

// DBtoAPI : Converts a DB style struct to an API style struct
func DBtoAPI(run dbRun) apiRun {
	var out apiRun
	var journal []journalEntry

	deepcopier.Copy(run).To(out)

	json.Unmarshal([]byte(run.Journal), journal)
	out.Journal = journal

	return out
}
