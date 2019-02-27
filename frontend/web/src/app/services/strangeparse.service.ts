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
				selector: {
					$and: [
						{TeamNumber: {$gt: true}}
					]
				},
				fields: ['TeamNumber'],
				sort: ['TeamNumber']
			}).then(result => {
				result.docs.forEach(entry => {
					// @ts-ignore
					// doesn't know `TeamNumber` exists in the returned objects
					teams.push(entry.TeamNumber);
				});
				var dedupteams = this.removeDuplicate(teams);
				console.log(dedupteams);
				resolve(dedupteams);
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
				let sorted = dedupmatches.sort();
				console.log(sorted);
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
				console.log(result.docs);
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
				console.log(out);
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
			console.log(concatjournal)
			let average = (concatjournal.length / 2) / teamdata.length;
			resolve(average);
		})
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
