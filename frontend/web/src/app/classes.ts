export class Run {
	_id: string;
	type: 'run';
	TeamNumber: number;
	MatchNumber: number;
	StartPosition: string;
	Journal: EventJournalEntry[];
	Notes: string;
	Scouter: string;
	Timestamp: number;
	_rev?: string;
}

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
	EndDisable: boolean;
	Holdable: boolean;
	IgnoreHolding: boolean;
	SubEvents: OptionEventChoice[];
}
