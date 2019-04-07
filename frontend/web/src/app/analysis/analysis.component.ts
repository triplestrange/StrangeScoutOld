import { Component } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material';

import {StrangeparseService} from '../services/strangeparse.service';

import * as c3 from 'c3';

@Component({
	selector: 'app-analysis',
	templateUrl: './analysis.component.html',
	styleUrls: ['./analysis.component.css']
})
export class AnalysisComponent {

	data: any[];
	original: any[];
	allruns: any[];

	sort = {
		method: 'team',
		ascending: true
	}
	sortmethods = [
		{name: 'Team Number', value: 'team'},
		{name: 'Match Count', value: 'rawdata.length'},
		{name: 'Cycle Count', value: 'averages.cycles'},
		{name: 'Drop Count', value: 'averages.drops'},
		{name: 'Defense Time', value: 'averages.defensetime'},
		{name: 'Hatch Cycle Count', value: 'averages.hatch.cycles'},
		{name: 'Hatch Drop Count', value: 'averages.hatch.drops'},
		{name: 'Cargo Cycle Count', value: 'averages.cargo.cycles'},
		{name: 'Cargo Drop Count', value: 'averages.cargo.drops'}
	]

// CHARTS ------------------------------
	cyclechart: any;
	dropchart: any;
	hatchchart: any;
	cargochart: any;
	defensechart: any;
// -------------------------------------

	constructor(public sp: StrangeparseService) {
		this.data = [];
		this.original = [];
		// creates indexes if not exists
		this.sp.createIndexes()
			.catch(() => {}) //Subjective addition, should be added only if createIndex does not catch itself
			.then(async () => {
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
				this.data[index].notes = [];

				this.data[index].rawdata = [];

			});

			await this.sp.allData().then(result => {
				result.forEach(row => {
					//@ts-ignore
					let index = this.data.findIndex(x => x.team == row.TeamNumber)
					this.data[index].rawdata.push(row);
				});
			});

			await this.data.forEach(async (entry, index) => {

// OVERALL -----------------------------

				// calculate average cycles/match and set property
				this.sp.averageCycles(entry.team, entry.rawdata).then(result => {
					this.data[index].averages.cycles = Math.ceil(result*100)/100;
				});
				// calculate average dropped cycles/match and set property
				this.sp.averageDrops(entry.team, entry.rawdata).then(result => {
					this.data[index].averages.drops = Math.ceil(result*100)/100;
				});
				this.sp.averageDefenseTime(entry.team, entry.rawdata).then(result => {
					this.data[index].averages.defensetime = Math.ceil(result*100)/100;
				});
				this.sp.notes(entry.team, entry.rawdata).then(result => {
					this.data[index].notes = result;
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

// FILTERING ---------------------------

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

// CSV ---------------------------------

/**
 * Downloads a csv of the current data
 */
downloadCSV() {
	const csvcontents = this.csv;

	const m = new Date();
	const dateString =
	m.getUTCFullYear() + "-" +
	("0" + (m.getUTCMonth()+1)).slice(-2) + "-" +
	("0" + m.getUTCDate()).slice(-2) + "_" +
	("0" + m.getUTCHours()).slice(-2) + "-" +
	("0" + m.getUTCMinutes()).slice(-2) + "-" +
	("0" + m.getUTCSeconds()).slice(-2);

	const filename = `scouting_${dateString}.csv`

	this.downloadString(csvcontents, 'text/csv', filename)
}

get csv() {
	let csvcontents = 'Team Number, Match Count, Cycles, Drops, Defense Time, Hatch Cycles, Hatch Drops, Top Hatch, Middle Hatch, Bottom Hatch, Cargo Hatch, Cargo Cycles, Cargo Drops, Top Cargo, Middle Cargo, Bottom Cargo, Cargo Cargo';
	csvcontents = csvcontents.concat('\n');
	this.data.forEach(e => {

		let row = '';
		row = row.concat(`${e.team}, ${e.rawdata.length}, ${e.averages.cycles}, ${e.averages.drops}, ${e.averages.defensetime}, `)
		row = row.concat(`${e.averages.hatch.cycles}, ${e.averages.hatch.drops}, ${e.averages.hatch.top}, ${e.averages.hatch.middle}, ${e.averages.hatch.bottom}, ${e.averages.hatch.cargo}, `);
		row = row.concat(`${e.averages.cargo.cycles}, ${e.averages.cargo.drops}, ${e.averages.cargo.top}, ${e.averages.cargo.middle}, ${e.averages.cargo.bottom}, ${e.averages.cargo.cargo}`);
		row = row.concat('\n');
		csvcontents = csvcontents.concat(row);
	});
	
	return csvcontents;
}

// from https://gist.github.com/danallison/3ec9d5314788b337b682
/**
 * downloads a string as a file
 * @param text string contents
 * @param fileType file type
 * @param fileName file name
 */
downloadString(text, fileType, fileName) {
	var blob = new Blob([text], { type: fileType });

	var a = document.createElement('a');
	a.download = fileName;
	a.href = URL.createObjectURL(blob);
	a.dataset.downloadurl = [fileType, a.download, a.href].join(':');
	a.style.display = "none";
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
	setTimeout(() => {
		URL.revokeObjectURL(a.href);
	}, 1500);
}

// GRAPHS ------------------------------

	tabChange(event: MatTabChangeEvent) {
		if (event.tab.textLabel === "Charts") {
			this.createGraphs();
		}
	}

	createGraphs() {
		this.cyclechart = c3.generate({
			bindto: '#cyclechart',
			data: {
				type: 'bar',
				columns: [],
				order: null
			},
			bar: {width: {
				ratio: 0.5
			}},
			axis: {x: {tick: {
					format: (x) => {return ''}
				}}
			}
		});
		this.dropchart = c3.generate({
			bindto: '#dropchart',
			data: {
				type: 'bar',
				columns: [],
				order: null
			},
			bar: {width: {
					ratio: 0.5
			}},
			axis: {x: {tick: {
					format: (x) => {return ''}
				}}
			}
		});
		this.hatchchart = c3.generate({
			bindto: '#hatchchart',
			data: {
				type: 'bar',
				columns: [],
				order: null
			},
			bar: {width: {
					ratio: 0.5
			}},
			axis: {x: {tick: {
					format: (x) => {return ''}
				}}
			}
		});
		this.cargochart = c3.generate({
			bindto: '#cargochart',
			data: {
				type: 'bar',
				columns: [],
				order: null
			},
			bar: {width: {
					ratio: 0.5
			}},
			axis: {x: {tick: {
					format: (x) => {return ''}
				}}
			}
		});
		this.defensechart = c3.generate({
			bindto: '#defensechart',
			data: {
				type: 'bar',
				columns: [],
				order: null
			},
			bar: {width: {
					ratio: 0.5
			}},
			axis: {x: {tick: {
					format: (x) => {return ''}
				}}
			}
		});
	}

	reloadGraphs() {
		this.cyclechart.load({
			unload: true,
			columns: this.cyclecolumns
		});
		this.dropchart.load({
			unload: true,
			columns: this.dropcolumns
		});
		this.hatchchart.load({
			unload: true,
			columns: this.hatchcolumns
		});
		this.cargochart.load({
			unload: true,
			columns: this.cargocolumns
		});
		this.defensechart.load({
			unload: true,
			columns: this.defensecolumns
		});
	}

// COLUMNS -----------------------------

	get cyclecolumns() {
		let cyclecolumns: any[];
		cyclecolumns = [];	
		this.data.forEach((element) => {
			cyclecolumns.push([element.team.toString(), element.averages.cycles])
		});
		return cyclecolumns;
	}
	get dropcolumns() {
		let columns: any[];
		columns = [];	
		this.data.forEach((element) => {
			columns.push([element.team.toString(), element.averages.drops])
		});
		return columns;
	}
	get hatchcolumns() {
		let columns: any[];
		columns = [];	
		this.data.forEach((element) => {
			columns.push([element.team.toString(), element.averages.hatch.cycles])
		});
		return columns;
	}
	get cargocolumns() {
		let columns: any[];
		columns = [];	
		this.data.forEach((element) => {
			columns.push([element.team.toString(), element.averages.cargo.cycles])
		});
		return columns;
	}
	get defensecolumns() {
		let columns: any[];
		columns = [];	
		this.data.forEach((element) => {
			columns.push([element.team.toString(), element.averages.defensetime])
		});
		return columns;
	}

}
