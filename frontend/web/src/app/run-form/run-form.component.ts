import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';

// dialog imports
import { MatDialog } from '@angular/material';

// dialog components
import { BeginMatchDialogComponent } from '../dialogs/begin-match-dialog/begin-match-dialog.component';
import { ElementEventDialogComponent } from '../dialogs/element-event-dialog/element-event-dialog.component';
import { EndMatchDialogComponent } from '../dialogs/end-match-dialog/end-match-dialog.component';
import { LoginDialogComponent } from '../dialogs/login-dialog/login-dialog.component';

// scouter id service
import { UserService } from '../services/user.service';

// data for the form body
import { RunFormDataService } from '../run-form-data.service';

// db service
import { PouchdbService } from '../services/pouchdb.service';

// custom classes
import { EventJournalEntry, OptionEventChoice, GameElement, Run } from '../classes';

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
	notes = '';
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

	/**
	 * Used to start the match
	 * 
	 * Opens begin dialog, on close unhides form, starts counter, and opens initial event dialog
	 */
	startMatch() {
		// popup before match start
		const dialogRef = this.dialog.open(BeginMatchDialogComponent);
		// after closing popup
		dialogRef.afterClosed().subscribe(result => {
			// show form body
			this.showForm = true;

			// if the starting load is not "none"
			if (this.load !== 'none') {
				// local var of load
				const load = this.load;

				// loadout journal entry
				let entry = new EventJournalEntry;
				entry.Time = 0;
				entry.Event = this.load;
				this.journal.push(entry);
				
				// find the gameElement with a matching top level event to the load value
				const element = this.gameElements.find(item => {
					return item.Event === load;
				});
				// opens a popup with sub events
				const dialogRef = this.dialog.open(ElementEventDialogComponent, {width: '250px', disableClose: true, autoFocus: false, data: element});
				// after the popup is closed
				dialogRef.afterClosed().subscribe(result => {
					if (result === 'cancel') {
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

	/**
	 * Opens the element dialog - used after a get event
	 * @param element Name of the game element
	 */
	getElement(element) {
		// creates a new journal entry for the event specified by the element
		if (element.Event !== '') {
			this.newJournalEntry(element.Event);
		}
		// opens a popup with sub events
		const dialogRef = this.dialog.open(ElementEventDialogComponent, {width: '250px', disableClose: true, autoFocus: false, data: element});
		// after the popup is closed
		dialogRef.afterClosed().subscribe(result => {
			if (result === 'cancel') {
				// remove the last event if canceled
				this.journal.pop();
			} else {
				// new event
				this.newJournalEntry(result);
			}
		});
	}

	/**
	 * Adds an event to the journal
	 * @param Event Event name
	 */
	newJournalEntry(Event: string) {
		// new entry of class EventJournalEntry
		let entry = new EventJournalEntry;
		// set elapsed time of event
		entry.Time = this.counter - this.time;
		// set event name
		entry.Event = Event;
		// add to journal
		this.journal.push(entry);
	}

	/**
	 * returns a beautified string of the last event
	 */
	get lastEvent(): string {
		if (this.journal.length > 0) {
			let event = this.journal[this.journal.length - 1].Event;
			event = event.replace(/([a-z\xE0-\xFF])([A-Z\xC0\xDF])/g, '$1 $2');
			event = event.replace(/^./, str => {
				return str.toUpperCase();
			});
			return event;
		} else {
			return 'None';
		}
	}

	/**
	 * returns a human readable remaining time count
	 */
	get displayTime(): string {
		// get minutes from countdown
		const minutes = Math.floor(this.time / 60);
		// get seconds from countdown
		const seconds = this.time - (minutes * 60);
		// format countdown to display
		return minutes + ':' + ('0' + seconds).slice(-2);
	}

	/**
	 * returns the match payload
	 */
	get payload(): {} {
		// get timestamp data
		const now = new Date;
		const utc_timestamp = Date.UTC(
			now.getFullYear(),
			now.getMonth(),
			now.getDate(),
			now.getHours(),
			now.getMinutes(),
			now.getSeconds(),
			now.getMilliseconds()
		);
		// create JSON payload from all form objects
		const load: Run = {
			_id: this.team.toString() + '_' + this.match.toString(),
			type: 'run',
			TeamNumber: this.team,
			MatchNumber: this.match,
			StartPosition: this.start,
			Journal: this.journal,
			Notes: this.notes,
			Scouter: this.us.getID(),
			Timestamp: utc_timestamp
		}
		return this.removeFalsy(load);
	}

	/**
	 * Used to end the match
	 * 
	 * Opens end match dialog containing notes - on close submits the payload
	 */
	endMatch() {
		// popup before match start
		const dialogRef = this.dialog.open(EndMatchDialogComponent, {disableClose: true});
		// after closing popup
		dialogRef.afterClosed().subscribe(result => {
			this.notes = result;
			this.onSubmit();
		});
	}

	/**
	 * Submits payload
	 * 
	 * Stores payload in local database then syncs with remote
	 */
	onSubmit() {
		const payload = this.payload;

		this.dbs.storeLocal(payload).then(() => {
			const self = this;
			const xhr = new XMLHttpRequest;
			const url = `${location.protocol}//db.${window.location.host}/_session`;
			xhr.open('GET', url);
			xhr.withCredentials = true;
			xhr.onreadystatechange = function() {
				// Call a function when the state changes.
				if (xhr.readyState === XMLHttpRequest.DONE) {
					if (JSON.parse(xhr.responseText).userCtx.name === null) {
						self.dialog.open(LoginDialogComponent, {disableClose: true}).afterClosed().subscribe(result => {
							window.dispatchEvent(new CustomEvent('newLogin'));
							self.dbs.syncRemote();
						});
					} else {
						self.dbs.syncRemote();
					}
				}
			}
			xhr.send();
		});
	}

	/**
	 * Main form page undo button
	 *
	 * Removes the last journal event and opens the coresponding dialog for whatever get event came before
	 */
	undo() {
		if (this.journal.length > 0) {
			const last = this.journal[this.journal.length - 2].Event;
			const elem = this.gameElements.find(function(element) {
				console.log(last, '::', element.Event)
				return element.Event === last;
			});
			this.journal.pop();
			// opens a popup with sub events
			console.log(elem)
			const dialogRef = this.dialog.open(ElementEventDialogComponent, {width: '250px', disableClose: true, autoFocus: false, data: elem});
			// after the popup is closed
			dialogRef.afterClosed().subscribe(result => {
				if (result === 'cancel') {
					// remove the last event if canceled
					this.journal.pop();
				} else {
					// new event
					this.newJournalEntry(result);
				}
			});
		}
	}

	/**
	 * Removes nulls from an object
	 * @param obj Object to remove nulls from
	 */
	removeFalsy(obj: {}): {} {
		const newObj = {};
		Object.keys(obj).forEach((prop) => {
			if (obj[prop]) { newObj[prop] = obj[prop]; }
		});
		return newObj;
	}

}
