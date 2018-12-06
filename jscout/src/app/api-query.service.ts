import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class ApiQueryService {

	getEvents(team: string): any {
		var xhr = new XMLHttpRequest();
		var requestPath: string;
		if (parseInt(team) == 0) {
			requestPath = "/api/team/" + team + "/events"
		} else {
			requestPath = "/api/events"
		}
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4) {
				if (xhr.status == 200) {
					return xhr.responseText;
				} else {
					return '[]'
				}
			}
		}
		xhr.open('GET', requestPath, true)
		xhr.send()
	}

	constructor() { }
}
