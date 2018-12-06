import { Component, OnInit } from '@angular/core';
import { ApiQueryService } from '../api-query.service';
import { query } from '@angular/core/src/render3';

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.css']
})
export class DataComponent implements OnInit {

	events: string[]
	teams: string[]
	matches: string[]

	event: string;
	team: string;
	match: string;

	constructor(private query: ApiQueryService) {
		this.loadEvents()
	}

	ngOnInit() {
	}

	loadEvents() {
		var response = this.query.getEvents(this.team)
		console.log(response)
		if (this.isJSON(response)) {
			this.events = JSON.parse(response)
		} else {
			this.events = []
		}
	}

	isJSON(j: string) {
		try {
			JSON.parse(j)
		} catch(e) {
			console.log("no")
			return false
		}
		console.log("yes")
		return true
	}
}
