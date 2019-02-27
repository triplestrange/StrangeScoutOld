import { Component, OnInit } from '@angular/core';

import {StrangeparseService} from '../services/strangeparse.service';

@Component({
	selector: 'app-analysis',
	templateUrl: './analysis.component.html',
	styleUrls: ['./analysis.component.css']
})
export class AnalysisComponent implements OnInit {

	data: any[];

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
			this.data.forEach((entry, index) => {
				// calculate average cycles/match and set property
				this.sp.averageCycles(entry.team).then(result => {
					this.data[index].averageCycles = result;
				});
				// calculate average dropped cycles/match and set property
				this.sp.averageDrops(entry.team).then(result => {
					this.data[index].averageDrops = result;
				});
				// get match tally and set property
				this.sp.getMatches(entry.team).then(result => {
					this.data[index].matchCount = result.length;
				});
				this.sp.averageElementCycles(entry.team, 'hatch').then(result => {
					this.data[index].averageHatch = result;
				});
			});
		});
	}

	/**
	 * Sort the data cards ascending by average cycle count
	 * @param descending sort in descending order
	 */
	cycleSort(descending?: boolean) {
		this.data.sort((a, b) => {
			if (a.averageCycles > b.averageCycles) {
				if (descending) return -1; else return 1;
			} else if (b.averageCycles > a.averageCycles) {
				if (descending) return 1; else return -1;
			} else {
				return 0;
			}
		});
	}

	ngOnInit() {
	}

}
