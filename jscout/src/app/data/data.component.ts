import { Component, OnInit } from '@angular/core';
import { ApiQueryService } from '../api-query.service';

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.css']
})
export class DataComponent implements OnInit {

	// sets
	events: string[]
	teams: string[]
	matches: string[]

	// selection
	event: string;
	team: string;
	match: string;

	constructor(private query: ApiQueryService) {
		// default selection
		this.event = "all"
		this.team = "0"
		this.match = "0"

		// initial index loads
		this.loadEvents()
		this.loadTeams()
		this.loadMatches()
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

	loadTeams() {
		var self = this
		this.query.getTeams(this.event, this.match, function(response) {
			if (self.isJSON(response)) {
				self.teams = JSON.parse(response)
			} else {
				self.teams = []
			}
		})
	}

	loadMatches() {
		var self = this
		this.query.getMatches(this.event, this.team, function(response) {
			if (self.isJSON(response)) {
				self.matches = JSON.parse(response)
			} else {
				self.matches = []
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
