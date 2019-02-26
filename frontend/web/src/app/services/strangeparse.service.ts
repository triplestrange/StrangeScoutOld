import { Injectable } from '@angular/core';

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
				console.log(teams);
				resolve(teams);
			}).catch(error => {
				console.log(`Error getting teams: ${error}`);
				resolve([]);
			});
		});

	}

	/**
	 * Resolves an array of match numbers with available data
	 */
	getMatches(): Promise<number[]> {

		return new Promise(resolve => {
			let matches: number[];
			matches = [];

			this.db.find({
				selector: {
					$and: [
						{MatchNumber: {$gt: true}}
					]
				},
				fields: ['MatchNumber'],
				sort: ['MatchNumber']
			}).then(result => {
				result.docs.forEach(entry => {
					// @ts-ignore
					// doesn't know `MatchNumber` exists in the returned objects
					matches.push(entry.MatchNumber);
				});
				console.log(matches);
				resolve(matches);
			}).catch(error => {
				console.log(`Error getting matches: ${error}`);
				resolve([]);
			});
		});

	}
}
