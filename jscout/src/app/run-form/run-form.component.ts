import { Component, OnInit } from '@angular/core';

// dialog imports
import { MatDialog } from '@angular/material';

// dialog components
import { BeginMatchDialogComponent } from '../begin-match-dialog/begin-match-dialog.component'
import { ElementEventDialogComponent } from '../element-event-dialog/element-event-dialog.component'

// toasts
import { ToastrService } from 'ngx-toastr';

// cache service
import { PayloadStoreService } from '../payload-store.service';

// scouter id service
import { ScouterService } from '../scouter.service';

// custom classes
import { EventJournalEntry, OptionEventChoice, GameElement } from '../run-classes'

// data for the form body
import { RunFormDataService } from '../run-form-data.service'

@Component({
	selector: 'app-run-form',
	templateUrl: './run-form.component.html',
	styleUrls: ['./run-form.component.css'],
	providers: [ ScouterService ]
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

	constructor(private ss: ScouterService, private toastr: ToastrService, public dialog: MatDialog) {
		// listeners to trigger notifications
		window.addEventListener('submitcached', function (e) {
			toastr.warning('Data cached', 'Unable to contact server');
		});
		window.addEventListener('submitsuccess', function (e) {
			toastr.success('Data successfully submitted!');
		});
		window.addEventListener('submitduplicate', function (e) {
			toastr.warning('Duplicate data not recorded');
		});
		window.addEventListener('submiterror', function (e) {
			// @ts-ignore
			toastr.error(e.detail, 'ERROR');
		});
	}

	ngOnInit() {
	}

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
		this.newJournalEntry(element.Event);
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
		const scouter = { Scouter: this.ss.getScouter() };
		// general data objects
		const setup = { TeamNumber: this.team, MatchNumber: this.match, StartPosition: this.start };
		const end = { Notes: this.notes }
		// create JSON payload from all form objects
		return JSON.stringify(
			this.removeFalsy(
				Object.assign({}, setup, {"Journal": this.journal}, end, scouter, timestamp)
			)
		);
	}

	// removes nulls from object
	removeFalsy = (obj) => {
		const newObj = {};
		Object.keys(obj).forEach((prop) => {
			if (obj[prop]) { newObj[prop] = obj[prop]; }
		});
		return newObj;
	}

	// submit function
	onSubmit() {
		// we have to set a variable to payload because it's impossible to cal `this.payload` within the `onreadystatechange` function
		// use this value for all operations, even if you can access `this.payload` (ex. `xhr.send`)
		const payload = this.payload;

		const xhr = new XMLHttpRequest();

		// PUT asynchronously
		xhr.open('PUT', '/api/team/' + this.team + '/match/' + this.match, true);
		// Send the proper header information along with the request
		xhr.setRequestHeader('Content-type', 'application/json');
		xhr.onreadystatechange = function() {
			// Call a function when the state changes.
			if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 0) {
				// cache if no contact
				PayloadStoreService.storePayload(payload);
				window.dispatchEvent(new CustomEvent('submitcached'));
			} else if (xhr.readyState === XMLHttpRequest.DONE && xhr.status <= 299) {
				// success
				window.dispatchEvent(new CustomEvent('submitsuccess'));
			} else if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 409) {
				// duplicate
				window.dispatchEvent(new CustomEvent('submitduplicate'));
			} else if (xhr.readyState === XMLHttpRequest.DONE && xhr.status >= 300) {
				// set server response on error
				const serverresponse = `${xhr.status} ${xhr.statusText} -- ${xhr.responseText}`;
				window.dispatchEvent(new CustomEvent('submiterror', {detail: serverresponse}));
				// also cache response
				PayloadStoreService.storePayload(payload);
				window.dispatchEvent(new CustomEvent('submitcached'));
			}
		};
		// send POST request
		xhr.send(payload);
		// debugging alerts
			// alert(this.payload);
			// alert(xhr.responseText);
	}

}
