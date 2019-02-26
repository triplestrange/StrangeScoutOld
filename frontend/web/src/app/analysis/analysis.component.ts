import { Component, OnInit } from '@angular/core';

import {StrangeparseService} from '../services/strangeparse.service';

@Component({
	selector: 'app-analysis',
	templateUrl: './analysis.component.html',
	styleUrls: ['./analysis.component.css']
})
export class AnalysisComponent implements OnInit {

	teams: number[];
	matches: number[];

	constructor(public sp: StrangeparseService) {
		this.teams = [];
		this.matches = [];
		this.sp.createIndexes().then(() => {
			this.sp.getTeams().then(result => {
				this.teams = result;
			});
			this.sp.getMatches().then(result => {
				this.matches = result;
			});
		});
	}

	ngOnInit() {
	}

}
