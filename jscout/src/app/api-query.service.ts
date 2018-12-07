import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class ApiQueryService {

	getEvents(team: string, callback) {
		var xhr = new XMLHttpRequest();
		var requestPath: string;
		if (parseInt(team) == 0) {
			requestPath = "/api/events"
		} else {
			requestPath = "/api/team/" + team + "/events"
		}
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4) {
				if (xhr.status == 200) {
					callback(xhr.responseText)
				} else {
					callback('[]')
				}
			}
		}
		xhr.open('GET', requestPath, true)
		xhr.send()
	}

	getTeams(event: string, match: string, callback) {
		var xhr = new XMLHttpRequest();
		var requestPath: string;
		if (event == "all") {
				requestPath = "/api/teams"
		} else {
			if (parseInt(match) == 0) {
				requestPath = "/api/event/" + event + "/teams"
			} else {
				requestPath = "/api/event/" + event + "/match/" + match + "/teams"
			}
		}
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4) {
				if (xhr.status == 200) {
					callback(xhr.responseText)
				} else {
					callback('[]')
					return
				}
			}
		}
		xhr.open('GET', requestPath, true)
		xhr.send()
	}

	getMatches(event: string, team: string, callback) {
		var xhr = new XMLHttpRequest();
		var requestPath: string;
		if (event != "all") {
			if (parseInt(team) == 0) {
				requestPath = "/api/event/" + event + "/matches"
			} else {
				requestPath = "/api/event/" + event + "/team/" + team + "/matches"
			}
		} else {
			callback('[]')
			return
		}
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4) {
				if (xhr.status == 200) {
					callback(xhr.responseText)
				} else {
					callback('[]')
					return
				}
			}
		}
		xhr.open('GET', requestPath, true)
		xhr.send()
	}

	constructor() { }
}
