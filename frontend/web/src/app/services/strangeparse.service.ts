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
		return new Promise(resolve => {
			this.db.createIndex({
				index: {
					fields: ['MatchNumber', 'TeamNumber']
				}
			}).then(() => {
				resolve(true);
			}).catch(error => {
				console.log(`Error creating index: ${error}`);
				resolve(false);
			});
		});
	}

	/**
	 * Resolves an array of team numbers with available data
	 */
	getTeams(): Promise<number[]> {

		return new Promise(resolve => {
			let teams: number[];
			teams = [];

			this.db.find({
				selector: {
					type: 'run'
				},
				fields: ['TeamNumber']
			}).then(result => {
				result.docs.forEach(entry => {
					// @ts-ignore
					// doesn't know `TeamNumber` exists in the returned objects
					teams.push(entry.TeamNumber);
				});
				let dedupteams = this.removeDuplicate(teams);
				let sorted = dedupteams.sort((a, b) => {return a-b});
				resolve(sorted);
			}).catch(error => {
				console.log(`Error getting teams: ${error}`);
				resolve([]);
			});
		});

	}

	/**
	 * Resolves an array of match numbers with available data
	 * @param team optional parameter specifying a team to get the matches of
	 */
	getMatches(team?: number): Promise<number[]> {

		return new Promise(resolve => {
			let matches: number[];
			matches = [];

			this.db.find({
				selector: {
					type: 'run',
					TeamNumber: {$eq: team}
				},
				fields: ['MatchNumber']
			}).then(result => {
				result.docs.forEach(entry => {
					// @ts-ignore
					// doesn't know `MatchNumber` exists in the returned objects
					matches.push(entry.MatchNumber);
				});
				let dedupmatches = this.removeDuplicate(matches);
				let sorted = dedupmatches.sort((a, b) => {return a-b});
				resolve(sorted);
			}).catch(error => {
				console.log(`Error getting matches: ${error}`);
				resolve([]);
			});
		});

	}

// GET DATA ----------------------------

	/**
	 * Resolves an array of objects for all runs by a specified team
	 * @param team team to get runs of
	 */
	getTeam(team: number): Promise<any[]> {
		return new Promise(resolve => {
			this.db.find({
				selector: {
					type: 'run',
					TeamNumber: team
				}
			}).then(result => {
				resolve(this.dropDuplicateMatch(result.docs));
			});
		});
	}

	/**
	 * Resolves an array of objects
	 */
	allData(): Promise<{}[]> {
		return new Promise(resolve => {
			this.db.allDocs({
				include_docs: true
			}).then(result => {
				let out: any[];
				out = [];
				result.rows.forEach(row => {
					out.push(row.doc)
				})
				resolve(out)
			})
		})
	}

// AVERAGES ----------------------------

	/**
	 * Resolves the average cycles/match of a team
	 * @param team team number to get cycle count for
	 */
	averageCycles(team: number, rawdata?: any[]): Promise<number> {
		return new Promise(async resolve => {
			let concatjournal = [];
			let teamdata: any[];
			
			if (rawdata) {
				teamdata = rawdata;
			} else {
				teamdata = await this.getTeam(team);
			}

			teamdata.forEach(doc => {
				let tmp = concatjournal;
				// @ts-ignore
				// doesn't know `Journal` exists in the returned objects
				concatjournal = tmp.concat(doc.Journal)
			});
			
			let droplessjournal = this.removeDrops(concatjournal);
			let average = (droplessjournal.length / 2) / teamdata.length;

			resolve(average);
		});
	}

	/**
	 * Resolves the average dropped cycles/match of a team
	 * @param team team number to get dropped cycle count for
	 */
	averageDrops(team: number, rawdata?: any[]): Promise<number> {
		return new Promise(async resolve => {
			let concatjournal = [];
			let teamdata: any[];

			if (rawdata) {
				teamdata = rawdata;
			} else {
				teamdata = await this.getTeam(team);
			}

			teamdata.forEach(doc => {
				let tmp = concatjournal;
				// @ts-ignore
				// doesn't know `Journal` exists in the returned objects
				concatjournal = tmp.concat(doc.Journal)
			});

			let dropjournal = this.onlyDrops(concatjournal);
			let average = (dropjournal.length / 2) / teamdata.length;
			
			resolve(average);
		})
	}

	/**
	 * Resolves the average single element cycles/match of a team
	 * @param team team number to get cycle count for
	 * @param element lowercase name of element as seen in journal event
	 */
	averageElementCycles(team: number, element: string, rawdata?: any[]): Promise<number> {
		return new Promise(async resolve => {
			let concatjournal = [];
			let teamdata: any[];
			
			if (rawdata) {
				teamdata = rawdata;
			} else {
				teamdata = await this.getTeam(team);
			}

			teamdata.forEach(doc => {
				let tmp = concatjournal;
				// @ts-ignore
				// doesn't know `Journal` exists in the returned objects
				concatjournal = tmp.concat(doc.Journal)
			});

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
	 */
	averageElementDrops(team: number, element: string, rawdata?: any[]): Promise<number> {
		return new Promise(async resolve => {
			let concatjournal = [];
			let teamdata: any[];
			
			if (rawdata) {
				teamdata = rawdata;
			} else {
				teamdata = await this.getTeam(team);
			}

			teamdata.forEach(doc => {
				let tmp = concatjournal;
				// @ts-ignore
				// doesn't know `Journal` exists in the returned objects
				concatjournal = tmp.concat(doc.Journal)
			});
			
			let elementjournal = this.singleElement(concatjournal, element);
			let dropjournal = this.onlyDrops(elementjournal);
			let average = (dropjournal.length / 2) / teamdata.length;

			resolve(average);
		})
	}

	/**
	 * Resolves the average single element cycles/match of a team
	 * @param team team number to get cycle count for
	 * @param element lowercase name of element as seen in journal event
	 * @param destination lowercase name of element destination as seen in journal event
	 */
	averageDestinationCycles(team: number, element: string, destination: string, rawdata?: any[]): Promise<number> {
		return new Promise(async resolve => {
			let concatjournal = [];
			let teamdata: any[];
			
			if (rawdata) {
				teamdata = rawdata;
			} else {
				teamdata = await this.getTeam(team);
			}

			teamdata.forEach(doc => {
				let tmp = concatjournal;
				// @ts-ignore
				// doesn't know `Journal` exists in the returned objects
				concatjournal = tmp.concat(doc.Journal)
			});

			let destjournal = this.singleDestination(concatjournal, element, destination);
			let droplessjournal = this.removeDrops(destjournal);
			let average = droplessjournal.length / teamdata.length;

			resolve(average);
		})
	}

// JOURNAL MUTATIONS -------------------

	/**
	 * returns cycles only of a specific type
	 * @param journal journal to parse
	 * @param element element to pull
	 */
	singleElement(journal: any[], element: string): any[] {
		let newjournal = [];

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
		let newjournal = [];

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
	 * removes cycles resulting in a drop from a journal
	 * @param journal journal to remove drops from
	 */
	removeDrops(journal: any[]): any[] {
		let newjournal = [];

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
		let matches: number[];
		let final: any[];
		matches = [];
		final = [];
		src.forEach((value) => {
			let matchnum = value.MatchNumber;
			if (!matches.includes(matchnum)) {
				matches.push(matchnum);
				final.push(value);
			}
		});
		return final;
	}
}
