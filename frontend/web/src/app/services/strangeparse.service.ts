import { Injectable } from '@angular/core';

import { Run } from '../classes';

import PouchDB from 'pouchdb';
import PouchFind from 'pouchdb-find';
PouchDB.plugin(PouchFind);

@Injectable({
	providedIn: 'root'
})
export class StrangeparseService {

	constructor() {}

	db = new PouchDB('ssdb');

// INDEXING ----------------------------

	/**
	 * Creates indexes for team number and match number
	 *
	 * Resolves `true` on success, otherwise `false`
	 */
	createIndexes(): Promise<boolean> {
		return this.db.createIndex({
			index: {
				fields: ['TeamNumber']
			}
		}).then(() => {
			return true;
		}).catch(error => {
			console.log(`Error creating index: ${error}`);
			return false;
		});
	}

	/**
	 * Resolves an array of team numbers with available data
	 */
	getTeams(): Promise<number[]> {
		return this.db.find({
			selector: {
				type: 'run'
			},
			fields: ['TeamNumber']
		}).then(result => {
			let teams: number[];
			// @ts-ignore
			teams = result.docs.map(entry => entry.TeamNumber);
			
			let dedupteams = this.removeDuplicate(teams);
			let sorted = dedupteams.sort((a, b) => {return a-b});
			return sorted;
		}).catch(error => {
			console.log(`Error getting teams: ${error}`);
			return [];
		});

	}

// GET DATA ----------------------------

	/**
	 * Resolves an array of objects for all runs by a specified team
	 * @param team team to get runs of
	 */
	getTeam(team: number): Promise<any[]> {
		return this.db.find({
				selector: {
					type: 'run',
					TeamNumber: team
				}
			}).then(result => {
				return this.dropDuplicateMatch(result.docs);
			});
	}

	/**
	 * Resolves an array of objects
	 */
	allData(): Promise<{}[]> {
		return this.db.allDocs({
				include_docs: true
			}).then(result => {
				return result.rows
					.map(row => row.doc)
					.filter(elem => {
						//@ts-ignore
						return elem.type == 'run';
					});
			});
	}

// AVERAGES ----------------------------

	/**
	 * Resolves the average cycles/match of a team
	 * @param team team number to get cycle count for
	 * @param rawdata (optional) pass an array of doc objects to be parsed instead of querying the db
	 */
	averageCycles(team: number, rawdata?: any[]): Promise<number> {
		return new Promise(async resolve => {
			let concatjournal: any[];
			let teamdata: any[];

			let average: number = 0;
			
			if (rawdata) {
				teamdata = rawdata;
			} else {
				teamdata = await this.getTeam(team);
			}

			concatjournal = teamdata
				.map(doc => doc.Journal)
				.reduce((x,y) => x.concat(y), []);

			if (concatjournal.length > 0) {
				let droplessjournal = this.removeDrops(concatjournal);
				let climblessjournal = this.removeClimb(droplessjournal);
				let defenselessjournal = this.removeDefense(climblessjournal);
				average = (defenselessjournal.length / 2) / teamdata.length;
			}

			resolve(average);
		});
	}

	/**
	 * Resolves the average dropped cycles/match of a team
	 * @param team team number to get dropped cycle count for
	 * @param rawdata (optional) pass an array of doc objects to be parsed instead of querying the db
	 */
	averageDrops(team: number, rawdata?: any[]): Promise<number> {
		return new Promise(async resolve => {
			let concatjournal: any[];
			let teamdata: any[];

			if (rawdata) {
				teamdata = rawdata;
			} else {
				teamdata = await this.getTeam(team);
			}

			concatjournal = teamdata
				.map(doc => doc.Journal)
				.reduce((x,y) => x.concat(y), []);

			let dropjournal = this.onlyDrops(concatjournal);
			let average = (dropjournal.length / 2) / teamdata.length;
			
			resolve(average);
		})
	}

	/**
	 * Resolves the average single element cycles/match of a team
	 * @param team team number to get cycle count for
	 * @param element lowercase name of element as seen in journal event
	 * @param rawdata (optional) pass an array of doc objects to be parsed instead of querying the db
	 */
	averageElementCycles(team: number, element: string, rawdata?: any[]): Promise<number> {
		return new Promise(async resolve => {
			let concatjournal: any[];
			let teamdata: any[];
			
			if (rawdata) {
				teamdata = rawdata;
			} else {
				teamdata = await this.getTeam(team);
			}

			concatjournal = teamdata
				.map(doc => doc.Journal)
				.reduce((x,y) => x.concat(y), []);

			let elementjournal = this.singleElement(concatjournal, element);
			let droplessjournal = this.removeDrops(elementjournal);
			let average = (droplessjournal.length / 2) / teamdata.length;

			resolve(average);
		})
	}

	/**
	 * Resolves the average single element dropped cycles/match of a team
	 * @param team team number to get dropped cycle count for
	 * @param element lowercase name of element as seen in journal event
	 * @param rawdata (optional) pass an array of doc objects to be parsed instead of querying the db
	 */
	averageElementDrops(team: number, element: string, rawdata?: any[]): Promise<number> {
		return new Promise(async resolve => {
			let concatjournal: any[];
			let teamdata: any[];
			
			if (rawdata) {
				teamdata = rawdata;
			} else {
				teamdata = await this.getTeam(team);
			}

			concatjournal = teamdata
				.map(doc => doc.Journal)
				.reduce((x,y) => x.concat(y), []);
			
			let elementjournal = this.singleElement(concatjournal, element);
			let dropjournal = this.onlyDrops(elementjournal);
			let average = (dropjournal.length / 2) / teamdata.length;

			resolve(average);
		});
	}

	/**
	 * Resolves the average single element cycles/match of a team
	 * @param team team number to get cycle count for
	 * @param element lowercase name of element as seen in journal event
	 * @param destination lowercase name of element destination as seen in journal event
	 * @param rawdata (optional) pass an array of doc objects to be parsed instead of querying the db
	 */
	averageDestinationCycles(team: number, element: string, destination: string, rawdata?: any[]): Promise<number> {
		return new Promise(async resolve => {
			let concatjournal: any[];
			let teamdata: any[];
			
			if (rawdata) {
				teamdata = rawdata;
			} else {
				teamdata = await this.getTeam(team);
			}

			concatjournal = teamdata
				.map(doc => doc.Journal)
				.reduce((x,y) => x.concat(y), []);

			let destjournal = this.singleDestination(concatjournal, element, destination);
			let droplessjournal = this.removeDrops(destjournal);
			let average = droplessjournal.length / teamdata.length;

			resolve(average);
		})
	}

	/**
	 * Average time a team spends on defense (in seconds)
	 * @param team team number to get data for
	 * @param rawdata (optional) pass an array of doc objects to be parsed instead of querying the db
	 */
	averageDefenseTime(team: number, rawdata?: any[]): Promise<number> {
		return new Promise(async resolve => {
			let concatjournal: any[];
			let teamdata: any[];

			let totaltime: number = 0;
			let average: number = 0;
			
			if (rawdata) {
				teamdata = rawdata;
			} else {
				teamdata = await this.getTeam(team);
			}

			concatjournal = teamdata
				.map(doc => doc.Journal)
				.reduce((x,y) => x.concat(y), []);

			let defensejournal = this.onlyDefense(concatjournal);

			defensejournal.forEach((event, index) => {
				if (event.Event === 'stopDefense') {
					let duration = event.Time - defensejournal[index - 1].Time;
					totaltime = totaltime + duration;
				}
			});

			if (defensejournal.length !== 0) {
				average = totaltime / teamdata.length;
			}

			resolve(average);
		})
	}

// NOTES -------------------------------

/**
 * Resolves notes for a team
 * @param team team number to get notes for
 * @param rawdata (optional) pass an array of doc objects to be parsed instead of querying the db
 */
notes(team: number, rawdata?: any[]): Promise<string[]> {
	return new Promise(async resolve => {
		let notesArray: string[] = [];
		let teamdata: any[];
		
		if (rawdata) {
			teamdata = rawdata;
		} else {
			teamdata = await this.getTeam(team);
		}
	
		teamdata.forEach(doc => {
			if (doc.Notes) {
				notesArray.push(doc.Notes);
			}
		});

		resolve(notesArray);
	});
}

// JOURNAL MUTATIONS -------------------

	/**
	 * returns cycles only of a specific type
	 * @param journal journal to parse
	 * @param element element to pull
	 */
	singleElement(journal: any[], element: string): any[] {
		let newjournal: any[] = [];

		journal.forEach(event => {
			let word: string;
			let eventname = event.Event.replace(/([a-z\xE0-\xFF])([A-Z\xC0\xDF])/g, '$1 $2');

			let words = eventname.replace(/^./, str => {
				return str.toLowerCase();
			}).split(' ');

			word = words[words.length - 1];

			if (word.toLowerCase() === element.toLowerCase()) {
				newjournal.push(event);
			}
		});

		return newjournal;
	}

	/**
	 * returns cycles only of a specific type
	 * @param journal journal to parse
	 * @param element element to pull
	 */
	singleDestination(journal: any[], element: string, destination: string): any[] {
		let newjournal: any[] = [];

		journal.forEach(event => {
			let word1: string;
			let word2: string;
			let eventname = event.Event.replace(/([a-z\xE0-\xFF])([A-Z\xC0\xDF])/g, '$1 $2');

			let words = eventname.replace(/^./, str => {
				return str.toLowerCase();
			}).split(' ');

			word1 = words[0];
			word2 = words[words.length - 1];

			if ((word2.toLowerCase() === element.toLowerCase()) && (word1.toLowerCase() === destination.toLowerCase())) {
				newjournal.push(event);
			}
		});

		return newjournal;
	}

	/**
	 * removes defense from a journal
	 * @param journal journal to remove defense from
	 */
	removeDefense(journal: any[]): any[] {
		let newjournal: any[] = [];

		journal.forEach(event => {
			let eventname = event.Event.replace(/([a-z\xE0-\xFF])([A-Z\xC0\xDF])/g, '$1 $2');
			let word = eventname.replace(/^./, str => {
				return str.toLowerCase();
			}).split(' ')[1];
			if (word !== 'Defense') {
				newjournal.push(event);
			}
		});

		return newjournal;
	}

	/**
	 * return only defense events in a journal
	 * @param journal journal to parse
	 */
	onlyDefense(journal: any[]): any[] {
		let newjournal: any[] = [];

		journal.forEach(event => {
			let eventname = event.Event.replace(/([a-z\xE0-\xFF])([A-Z\xC0\xDF])/g, '$1 $2');
			let word = eventname.replace(/^./, str => {
				return str.toLowerCase();
			}).split(' ')[1];
			if (word === 'Defense') {
				newjournal.push(event);
			}
		});

		return newjournal;
	}

	/**
	 * removes cycles resulting in a drop from a journal
	 * @param journal journal to remove drops from
	 */
	removeDrops(journal: any[]): any[] {
		let newjournal: any[] = [];

		journal.forEach(event => {
			let eventname = event.Event.replace(/([a-z\xE0-\xFF])([A-Z\xC0\xDF])/g, '$1 $2');
			let word = eventname.replace(/^./, str => {
				return str.toLowerCase();
			}).split(' ')[0];
			if (word === 'drop') {
				newjournal.pop();
			} else {
				newjournal.push(event);
			}
		});

		return newjournal;
	}

	/**
	 * removes all non-dropped cycles from a journal
	 * @param journal journal to return drops of
	 */
	onlyDrops(journal: any[]): any[] {
		let filterjournal = this.removeDrops(journal);
		
		let newjournal = journal.filter(item => {
			return filterjournal.indexOf(item) < 0;
		});

		return newjournal;
	}

	/**
	 * Removes climbs from a journal
	 * @param src source journal
	 */
	removeClimb(src: any[]): any[] {
		while (src.length > 0 && src[src.length - 1].Event.substr(src[src.length - 1].Event.length - 5) === 'Climb') {
			src.pop();
		}
		return src;
	}

// EXTRA -------------------------------

	// from `https://gist.github.com/telekosmos/3b62a31a5c43f40849bb`
	/**
	 * Removes duplicates from an array
	 * @param src source array
	 */
	removeDuplicate(src: any[]): any[] {
		return src.filter((elem, pos, arr) => {
			return arr.indexOf(elem) == pos;
		});
	}

	/**
	 * Removes docs with matching match numbers
	 * @param src Array of docs
	 */
	dropDuplicateMatch(src: any[]): any[] {
		let matches: any = {};

		return src.filter((value) => {
			let matchnum = value.MatchNumber.toString();
			if (!matches[matchnum]) {
				matches[matchnum] = true;
				return true;
			} else {
				return false;
			}
		});
	}
}
