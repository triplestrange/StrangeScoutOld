package main

// run struct
type run struct {
	Event                 string         `gorm:"type:varchar(100); not null; primary_key"`
	TeamNumber            uint16         `gorm:"type:smallint; not null; primary_key"`
	MatchNumber           uint8          `gorm:"type:smallint; not null; primary_key"`
	StartPosition         string         `gorm:"type:varchar(100)"`
	Journal               []journalEntry `gorm:"type:json"`
	Notes                 string         `gorm:"type:text(65535)"`
	Scouter               string         `gorm:"type:varchar(100); primary_key"`
	Timestamp             uint64         `gorm:"type:bigint; not null"`
}

type journalEntry struct {
	Time  uint16
	Event string
}