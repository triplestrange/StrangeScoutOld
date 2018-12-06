import { Component, OnInit } from '@angular/core';
import { ApiQueryService } from '../api-query.service';

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
		var self = this
		this.query.getEvents(this.team, function(response) {
			if (self.isJSON(response)) {
				self.events = JSON.parse(response)
			} else {
				self.events = []
			}
		})
	}

	isJSON(j: string) {
		try {
			JSON.parse(j)
		} catch(e) {
			return false
		}
		return true
	}
}
