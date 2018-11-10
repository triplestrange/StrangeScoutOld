package main

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
