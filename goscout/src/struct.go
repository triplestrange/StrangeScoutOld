package main

// run struct
type run struct {
	Event                 string `gorm:"type:varchar(100); not null; primary_key"`
	TeamNumber            uint16 `gorm:"type:smallint; not null; primary_key"`
	MatchNumber           uint8  `gorm:"type:smallint; not null; primary_key"`
	StartPosition         string `gorm:"type:varchar(100)"`
	SandBottomShipPanel   uint8  `gorm:"type:tinyint"`
	SandMiddleShipPanel   uint8  `gorm:"type:tinyint"`
	SandTopShipPanel      uint8  `gorm:"type:tinyint"`
	SandCargoBayPanel     uint8  `gorm:"type:tinyint"`
	SandBottomShipCargo   uint8  `gorm:"type:tinyint"`
	SandMiddleShipCargo   uint8  `gorm:"type:tinyint"`
	SandTopShipCargo      uint8  `gorm:"type:tinyint"`
	SandCargoBayCargo     uint8  `gorm:"type:tinyint"`
	BottomShipPanel       uint8  `gorm:"type:tinyint"`
	MiddleShipPanel       uint8  `gorm:"type:tinyint"`
	TopShipPanel          uint8  `gorm:"type:tinyint"`
	CargoBayPanel         uint8  `gorm:"type:tinyint"`
	BottomShipCargo       uint8  `gorm:"type:tinyint"`
	MiddleShipCargo       uint8  `gorm:"type:tinyint"`
	TopShipCargo          uint8  `gorm:"type:tinyint"`
	CargoBayCargo         uint8  `gorm:"type:tinyint"`
	HabitatPosition       string `gorm:"type:varchar(100)"`
	YellowCards           uint8  `gorm:"type:tinyint"`
	RedCards              uint8  `gorm:"type:tinyint"`
	Notes                 string `gorm:"type:text(65535)"`
	Scouter               string `gorm:"type:varchar(100); primary_key"`
	Timestamp             string `gorm:"type:datetime; not null"`
}
