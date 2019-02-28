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
				selector: {},
				fields: ['TeamNumber']
			}).then(result => {
				result.docs.forEach(entry => {
					// @ts-ignore
					// doesn't know `TeamNumber` exists in the returned objects
					teams.push(entry.TeamNumber);
				});
				let dedupteams = this.removeDuplicate(teams);
				let sorted = dedupteams.sort(function(a, b){return a-b});
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
				let sorted = dedupmatches.sort(function(a, b){return a-b});
				resolve(sorted);
			}).catch(error => {
				console.log(`Error getting matches: ${error}`);
				resolve([]);
			});
		});

	}

	/**
	 * Resolves an array of objects for all runs by a specified team
	 * @param team team to get runs of
	 */
	getTeam(team: number): Promise<{}[]> {
		return new Promise(resolve => {
			this.db.find({
				selector: {
					TeamNumber: team
				}
			}).then(result => {
				resolve(result.docs);
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

	/**
	 * Resolves the average cycles/match of a team
	 * @param team team number to get cycle count for
	 */
	averageCycles(team: number): Promise<number> {
		return new Promise(async resolve => {
			let concatjournal = [];
			let teamdata = await this.getTeam(team);

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
	averageDrops(team: number): Promise<number> {
		return new Promise(async resolve => {
			let concatjournal = [];
			let teamdata = await this.getTeam(team);

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
	 */
	averageElementCycles(team: number, element: string): Promise<number> {
		return new Promise(async resolve => {
			let concatjournal = [];
			let teamdata = await this.getTeam(team);

			teamdata.forEach(doc => {
				let tmp = concatjournal;
				// @ts-ignore
				// doesn't know `Journal` exists in the returned objects
				concatjournal = tmp.concat(doc.Journal)
			});
			
			let elementjournal = this.singleElement(concatjournal, element);
			let average = (elementjournal.length / 2) / teamdata.length;

			resolve(average);
		})
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

	// from `https://gist.github.com/telekosmos/3b62a31a5c43f40849bb`
	/**
	 * Removes duplicates from an array
	 * @param src source array
	 */
	removeDuplicate(src: any[]): any[] {
		return src.filter(function(elem, pos,arr) {
			return arr.indexOf(elem) == pos;
		});
	}
}
