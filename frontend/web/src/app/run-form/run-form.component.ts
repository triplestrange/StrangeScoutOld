import { Component, OnInit } from '@angular/core';

// dialog imports
import { MatDialog } from '@angular/material';

// dialog components
import { BeginMatchDialogComponent } from '../dialogs/begin-match-dialog/begin-match-dialog.component'
import { ElementEventDialogComponent } from '../dialogs/element-event-dialog/element-event-dialog.component'
import { EndMatchDialogComponent } from '../dialogs/end-match-dialog/end-match-dialog.component'

// scouter id service
import { UserService } from '../services/user.service';

// data for the form body
import { RunFormDataService } from '../run-form-data.service';

// db service
import { PouchdbService } from '../services/pouchdb.service';

// custom classes
import { EventJournalEntry, OptionEventChoice, GameElement } from '../run-classes';

@Component({
	selector: 'app-run-form',
	templateUrl: './run-form.component.html',
	styleUrls: ['./run-form.component.css'],
	providers: [ UserService ]
})
export class RunFormComponent implements OnInit {

	// bool to show form contents
	showForm = false;

	// countdown vars
	time: number;
	counter = 150;
	interval = 1000;

	// data to collect
	team: number;
	match: number;
	start: string;
	load: string;
	notes = "";
	// empty journal array
	journal: EventJournalEntry[] = [];

	// starting positions
	startingPositions: OptionEventChoice[] = RunFormDataService.startingPositions;
	// starting configs
	startingConfigs: OptionEventChoice[] = RunFormDataService.startingConfigs;
	// define possible events
	gameElements: GameElement[] = RunFormDataService.gameElements;

	// define change event
	changeEvent = new Event('change');

	constructor(private us: UserService, private dialog: MatDialog, private dbs: PouchdbService) {}

	ngOnInit() {}

	// on start
	startMatch() {
		// popup before match start
		const dialogRef = this.dialog.open(BeginMatchDialogComponent);
		// after closing popup
		dialogRef.afterClosed().subscribe(result => {
			// show form body
			this.showForm = true;

			// if the starting load is not "none"
			if (this.load !== "none") {
				// local var of load
				var load = this.load

				// loadout journal entry
				var entry = new EventJournalEntry;
				entry.Time = 0;
				entry.Event = this.load;
				this.journal.push(entry);
				
				// find the gameElement with a matching top level event to the load value
				var element = this.gameElements.find(function(item){return item.Event === load})
				// opens a popup with sub events
				const dialogRef = this.dialog.open(ElementEventDialogComponent, {width: "250px", disableClose: true, autoFocus: false, data: element});
				// after the popup is closed
				dialogRef.afterClosed().subscribe(result => {
					if (result === "cancel") {
						// remove last event if canceled
						this.journal.pop();
					} else {
						// new event
						this.newJournalEntry(result);
					}
				});
			}
		});
	}

	// run after a getElement event
	getElement(element) {
		// creates a new journal entry for the event specified by the element
		if (element.Event !== "") {
			this.newJournalEntry(element.Event);
		}
		// opens a popup with sub events
		const dialogRef = this.dialog.open(ElementEventDialogComponent, {width: "250px", disableClose: true, autoFocus: false, data: element});
		// after the popup is closed
		dialogRef.afterClosed().subscribe(result => {
			if (result === "cancel") {
				// remove the last event if canceled
				this.journal.pop();
			} else {
				// new event
				this.newJournalEntry(result);
			}
		});
	}

	// add a new event to the journal
	newJournalEntry(Event: string) {
		// new entry of class EventJournalEntry
		var entry = new EventJournalEntry;
		// set elapsed time of event
		entry.Time = this.counter - this.time;
		// set event name
		entry.Event = Event;
		// add to journal
		this.journal.push(entry);
	}

	get lastEvent() {
		if (this.journal.length > 0) {
			var event = this.journal[this.journal.length-1].Event;
			event = event.replace(/([a-z\xE0-\xFF])([A-Z\xC0\xDF])/g, '$1 $2');
			event = event.replace(/^./, function(str){ return str.toUpperCase(); });
			return event;
		} else {
			return "None";
		}
	}

	get displayTime() {
		// get minutes from countdown
		var minutes = Math.floor(this.time / 60);
		// get seconds from countdown
		var seconds = this.time - (minutes * 60);
		// format countdown to display
		return minutes + ":" + ("0" + seconds).slice(-2);
	}

	get payload() {
		// get timestamp data
		var now = new Date;
		var utc_timestamp = Date.UTC(now.getFullYear(),now.getMonth(), now.getDate(), now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds());
		// create timestamp object
		const timestamp = { Timestamp: utc_timestamp };
		// get scouter
		const scouter = { Scouter: this.us.getID() };
		// general data objects
		const setup = { TeamNumber: this.team, MatchNumber: this.match, StartPosition: this.start };
		const end = { Notes: this.notes }
		// create JSON payload from all form objects
		return this.removeFalsy(
			Object.assign({}, {"_id":setup.TeamNumber.toString()+"_"+setup.MatchNumber.toString()}, setup, {"Journal": this.journal}, end, scouter, timestamp)
			);
	}

	endMatch() {
		// popup before match start
		const dialogRef = this.dialog.open(EndMatchDialogComponent, {disableClose: true});
		// after closing popup
		dialogRef.afterClosed().subscribe(result => {
			this.notes = result;
			this.onSubmit();
		});
	}

	// submit function
	onSubmit() {
		const payload = this.payload;

		this.dbs.storeLocal(payload);
		this.dbs.syncRemote();
	}

	// removes nulls from object
	removeFalsy = (obj) => {
		const newObj = {};
		Object.keys(obj).forEach((prop) => {
			if (obj[prop]) { newObj[prop] = obj[prop]; }
		});
		return newObj;
	}

}
