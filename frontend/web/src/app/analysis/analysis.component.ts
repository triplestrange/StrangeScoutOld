import { Component, AfterViewInit } from '@angular/core';

import {StrangeparseService} from '../services/strangeparse.service';

import * as c3 from 'c3';

@Component({
	selector: 'app-analysis',
	templateUrl: './analysis.component.html',
	styleUrls: ['./analysis.component.css']
})
export class AnalysisComponent implements AfterViewInit {

	data: any[];
	original: any[];

	sort = {
		method: 'team',
		ascending: true
	}
	sortmethods = [
		{name: 'Team Number', value: 'team'},
		{name: 'Match Count', value: 'matchCount'},
		{name: 'Cycle Count', value: 'averages.cycles'},
		{name: 'Drop Count', value: 'averages.drops'},
		{name: 'Hatch Cycle Count', value: 'averages.hatch.cycles'},
		{name: 'Hatch Drop Count', value: 'averages.hatch.drops'},
		{name: 'Cargo Cycle Count', value: 'averages.cargo.cycles'},
		{name: 'Cargo Drop Count', value: 'averages.cargo.drops'}
	]

// CHARTS ------------------------------
	cyclechart: any;
// -------------------------------------

	constructor(public sp: StrangeparseService) {
		this.data = [];
		this.original = [];
		// creates indexes if not exists
		this.sp.createIndexes().then(async () => {
			// gets list of teams from index
			// creates items in the data array for each
			// (executes synchronously)
			await this.sp.getTeams().then(result => {
				result.forEach(team => {
					this.data.push({team: team});
				});
			});
			// for each item in the data array (each team)
			await this.data.forEach(async (entry, index) => {

				this.data[index].averages = {};
				this.data[index].averages.hatch = {};
				this.data[index].averages.cargo = {};

				// get match tally and set property
				this.sp.getMatches(entry.team).then(result => {
					this.data[index].matchCount = result.length;
				});

				this.data[index].rawdata = await this.sp.getTeam(entry.team);

// OVERALL -----------------------------

				// calculate average cycles/match and set property
				this.sp.averageCycles(entry.team, entry.rawdata).then(result => {
					this.data[index].averages.cycles = Math.ceil(result*100)/100;
				});
				// calculate average dropped cycles/match and set property
				this.sp.averageDrops(entry.team, entry.rawdata).then(result => {
					this.data[index].averages.drops = Math.ceil(result*100)/100;
				});

// HATCH -------------------------------

				// calculate average hatch panel cycles/match and set property
				this.sp.averageElementCycles(entry.team, 'hatch', entry.rawdata).then(result => {
					this.data[index].averages.hatch.cycles = Math.ceil(result*100)/100;
				});
				// calculate average hatch panel dropped cycles/match and set property
				this.sp.averageElementDrops(entry.team, 'hatch', entry.rawdata).then(result => {
					this.data[index].averages.hatch.drops = Math.ceil(result*100)/100;
				});
				this.sp.averageDestinationCycles(entry.team, 'hatch', 'top', entry.rawdata).then(result =>{
					this.data[index].averages.hatch.top = Math.ceil(result*100)/100;
				});
				this.sp.averageDestinationCycles(entry.team, 'hatch', 'middle', entry.rawdata).then(result =>{
					this.data[index].averages.hatch.middle = Math.ceil(result*100)/100;
				});
				this.sp.averageDestinationCycles(entry.team, 'hatch', 'bottom', entry.rawdata).then(result =>{
					this.data[index].averages.hatch.bottom = Math.ceil(result*100)/100;
				});
				this.sp.averageDestinationCycles(entry.team, 'hatch', 'cargo', entry.rawdata).then(result =>{
					this.data[index].averages.hatch.cargo = Math.ceil(result*100)/100;
				});

// CARGO -------------------------------

				// calculate average cargo cycles/match and set property
				this.sp.averageElementCycles(entry.team, 'cargo', entry.rawdata).then(result => {
					this.data[index].averages.cargo.cycles = Math.ceil(result*100)/100;
				});
				// calculate average cargo dropped cycles/match and set property
				this.sp.averageElementDrops(entry.team, 'cargo', entry.rawdata).then(result => {
					this.data[index].averages.cargo.drops = Math.ceil(result*100)/100;
				});
				this.sp.averageDestinationCycles(entry.team, 'cargo', 'top', entry.rawdata).then(result =>{
					this.data[index].averages.cargo.top = Math.ceil(result*100)/100;
				});
				this.sp.averageDestinationCycles(entry.team, 'cargo', 'middle', entry.rawdata).then(result =>{
					this.data[index].averages.cargo.middle = Math.ceil(result*100)/100;
				});
				this.sp.averageDestinationCycles(entry.team, 'cargo', 'bottom', entry.rawdata).then(result =>{
					this.data[index].averages.cargo.bottom = Math.ceil(result*100)/100;
				});
				this.sp.averageDestinationCycles(entry.team, 'cargo', 'cargo', entry.rawdata).then(result =>{
					this.data[index].averages.cargo.cargo = Math.ceil(result*100)/100;
				});

// -------------------------------------

				console.log(this.data[index]);
			});
			// Can't use this \/ - seems to live reflect???
			// this.original = this.data;
			this.data.forEach((value) => {
				this.original.push(value);
			});
		});
	}

	/**
	 * Sort the data cards based on the sort object
	 */
	resort() {
		this.data.sort((a, b) => {
			a = eval('a.' + this.sort.method)
			b = eval('b.' + this.sort.method)

			if (a > b) {
				if (!this.sort.ascending) return -1; else return 1;
			} else if (b > a) {
				if (!this.sort.ascending) return 1; else return -1;
			} else {
				return 0;
			}
		});
		this.reloadGraphs();
	}

	/**
	 * Resets sorts and filter
	 */
	reset() {
		console.log(this.data)
		console.log(this.original)
		this.data = [];
		// Can't use this \/ - seems to live reflect???
		// this.data = this.original;
		this.original.forEach((value) => {
			this.data.push(value);
		})
		this.sort.ascending = true;
		this.sort.method = 'team';
		this.reloadGraphs();
	}

	/**
	 * Removes a team from the view
	 * @param team team number to drop
	 */
	dropTeam(team: number) {
		let index = this.data.findIndex(item => {
			return item.team === team;
		});
		this.data = this.data.filter((e, i) => {
			return i !== index;
		});
		this.reloadGraphs();
	}

// -------------------------------------

	ngAfterViewInit() {
		this.cyclechart = c3.generate({
			bindto: '#cyclechart',
			data: {
				type: 'bar',
				columns: [],
				order: null
			},
			bar: {
				width: {
					ratio: 0.5
				}
			},
			axis: {
				x: {
					tick: {
						format: (x) => {return ''}
					}
				}
			}
		});
	}

	reloadGraphs() {
		this.cyclechart.load({
			unload: true,
			columns: this.cyclecolumns
		});
		console.log(this.cyclecolumns)
	}

// -------------------------------------

	get cyclecolumns() {
		let cyclecolumns: any[];
		cyclecolumns = [];	
		this.data.forEach((element) => {
			cyclecolumns.push([element.team.toString(), element.averages.cycles])
		});
		console.log(cyclecolumns)
		return cyclecolumns;
	}

}
