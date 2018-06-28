import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatchData } from '../match-data';
import * as $ from 'jquery';

@Component({
  selector: 'app-match-form',
  templateUrl: './match-form.component.html',
  styleUrls: ['./match-form.component.css']
})
export class MatchFormComponent implements OnInit {

	// ngModel for match data
	matchModel = new MatchData('', '', '', false, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 'neither', 0, 0, '', '');

	// convert model to JSON string
	get matchPayload() {
		// get timestamp
		var dt = new Date();
		var year = dt.getUTCFullYear();
		var month = dt.getUTCMonth() + 1;
		var day = dt.getUTCDate();
		var hour = dt.getUTCHours();
		var minute = dt.getUTCMinutes();
		var second = dt.getUTCSeconds();
		this.matchModel.Timestamp = String(year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second);
		// return JSON string
		// NOTE: Converting TeamNumber and MatchNumber strings to int automatically for some reason?
		//       Could potentially break things later
		return JSON.stringify(this.matchModel);
	}

	// define change event
	changeEvent = new Event('change');

	// submit function
	onSubmit() { 
		var xhr = new XMLHttpRequest();
		
		// POST to /api/submitmatch asynchronously
		xhr.open("POST", '/api/submitmatch', true);

		//Send the proper header information along with the request
		xhr.setRequestHeader("Content-type", "text/plain");
		
		xhr.onreadystatechange = function () {
			//Call a function when the state changes.
			if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
				// Request finished. Do processing here.
				(<HTMLFormElement>document.getElementById("matchForm")).reset();
				alert("Data successfully submitted!");
			} else if (xhr.readyState == XMLHttpRequest.DONE && xhr.status != 200) {
				// Request failed. Do processing here.
				alert("Error submitting data: " + xhr.status);
			}
		}
		// send POST request
		xhr.send(this.matchPayload);
		// debugging alerts
//		alert(this.matchPayload);
//		alert(xhr.responseText);
	}

	plusbutton(id: string) {
		// increase a specific element by 1 and trigger a change event for it
		(<HTMLInputElement>document.getElementById(id)).stepUp();
		(<HTMLInputElement>document.getElementById(id)).dispatchEvent(this.changeEvent);
	}

	minusbutton(id: string) {
		// decrease a specific element by 1 and trigger a change event for it
		(<HTMLInputElement>document.getElementById(id)).stepDown();
		(<HTMLInputElement>document.getElementById(id)).dispatchEvent(this.changeEvent);
	}

	constructor() { 
	}
	
  ngOnInit() {
  }
}
