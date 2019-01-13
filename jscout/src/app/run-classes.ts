export class EventJournalEntry {
	Time: number;
	Event: string;
}

export class OptionEventChoice {
	Name: string;
	Value: string;
}

export class GameElement {
	Name: string;
	Event: string;
	RevealTime: number;
	SubEvents: OptionEventChoice[];
}