import { Component, OnInit } from '@angular/core';

import {StrangeparseService} from '../services/strangeparse.service';

@Component({
	selector: 'app-analysis',
	templateUrl: './analysis.component.html',
	styleUrls: ['./analysis.component.css']
})
export class AnalysisComponent implements OnInit {

	data: any[];

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

	constructor(public sp: StrangeparseService) {
		this.data = [];
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
			this.data.forEach(async (entry, index) => {
				this.data[index].visible = false;

				this.data[index].averages = {};
				this.data[index].averages.hatch = {};
				this.data[index].averages.cargo = {};

				// get match tally and set property
				await this.sp.getMatches(entry.team).then(result => {
					this.data[index].matchCount = result.length;
				});

// OVERALL -----------------------------

				// calculate average cycles/match and set property
				await this.sp.averageCycles(entry.team).then(result => {
					this.data[index].averages.cycles = Math.ceil(result*100)/100;
				});
				// calculate average dropped cycles/match and set property
				await this.sp.averageDrops(entry.team).then(result => {
					this.data[index].averages.drops = Math.ceil(result*100)/100;
				});

// HATCH -------------------------------

				// calculate average hatch panel cycles/match and set property
				await this.sp.averageElementCycles(entry.team, 'hatch').then(result => {
					this.data[index].averages.hatch.cycles = Math.ceil(result*100)/100;
				});
				// calculate average hatch panel dropped cycles/match and set property
				await this.sp.averageElementDrops(entry.team, 'hatch').then(result => {
					this.data[index].averages.hatch.drops = Math.ceil(result*100)/100;
				});
				await this.sp.averageDestinationCycles(entry.team, 'hatch', 'top').then(result =>{
					this.data[index].averages.hatch.top = Math.ceil(result*100)/100;
				});
				await this.sp.averageDestinationCycles(entry.team, 'hatch', 'middle').then(result =>{
					this.data[index].averages.hatch.middle = Math.ceil(result*100)/100;
				});
				await this.sp.averageDestinationCycles(entry.team, 'hatch', 'bottom').then(result =>{
					this.data[index].averages.hatch.bottom = Math.ceil(result*100)/100;
				});
				await this.sp.averageDestinationCycles(entry.team, 'hatch', 'cargo').then(result =>{
					this.data[index].averages.hatch.cargo = Math.ceil(result*100)/100;
				});

// CARGO -------------------------------

				// calculate average cargo cycles/match and set property
				await this.sp.averageElementCycles(entry.team, 'cargo').then(result => {
					this.data[index].averages.cargo.cycles = Math.ceil(result*100)/100;
				});
				// calculate average cargo dropped cycles/match and set property
				await this.sp.averageElementDrops(entry.team, 'cargo').then(result => {
					this.data[index].averages.cargo.drops = Math.ceil(result*100)/100;
				});
				await this.sp.averageDestinationCycles(entry.team, 'cargo', 'top').then(result =>{
					this.data[index].averages.cargo.top = Math.ceil(result*100)/100;
				});
				await this.sp.averageDestinationCycles(entry.team, 'cargo', 'middle').then(result =>{
					this.data[index].averages.cargo.middle = Math.ceil(result*100)/100;
				});
				await this.sp.averageDestinationCycles(entry.team, 'cargo', 'bottom').then(result =>{
					this.data[index].averages.cargo.bottom = Math.ceil(result*100)/100;
				});
				await this.sp.averageDestinationCycles(entry.team, 'cargo', 'cargo').then(result =>{
					this.data[index].averages.cargo.cargo = Math.ceil(result*100)/100;
				});

// -------------------------------------

				// set to display processed data
				this.data[index].visible = true;
				console.log(this.data[index]);
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
	}

	ngOnInit() {
	}

}
