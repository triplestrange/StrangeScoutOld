import { Component, OnInit } from '@angular/core';
import { RequestData } from '../request-data';

@Component({
  selector: 'app-analyze',
  templateUrl: './analyze.component.html',
  styleUrls: ['./analyze.component.css']
})
export class AnalyzeComponent implements OnInit {

	// ngModel for input to select what to scout
	Request = new RequestData(1);
	// empty strings - JSON formatted response string
	// and dataType which determines what the page shows
	responseString = "{}";
	dataType = "none";
	
	// Get a JSON string containing the value of the request number input
	get requestPayload() { return JSON.stringify(this.Request); }

	// example response JSON string
//	responseString = '{"MatchNumber":2,"BlueAlliance":{"Team1":{"TeamNumber":1533,"StartPosition":"Blue 1","AutoMovementLine":true,"AutoSwitchCubes":0,"AutoScaleCubes":2},"Team2":{"TeamNumber":1533,"StartPosition":"Blue 2","AutoMovementLine":true,"AutoSwitchCubes":1,"AutoScaleCubes":1},"Team3":{"TeamNumber":1533,"StartPosition":"Blue 3","AutoMovementLine":true,"AutoSwitchCubes":1,"AutoScaleCubes":0}},"RedAlliance":{"Team1":{"TeamNumber":1533,"StartPosition":"Red 1","AutoMovementLine":true,"AutoSwitchCubes":0,"AutoScaleCubes":0},"Team2":{"TeamNumber":1533,"StartPosition":"Red 2","AutoMovementLine":true,"AutoSwitchCubes":2,"AutoScaleCubes":0},"Team3":{"TeamNumber":1533,"StartPosition":"Red 3","AutoMovementLine":true,"AutoSwitchCubes":0,"AutoScaleCubes":1}}}'
	// parse the returned JSON into an object
	data = JSON.parse(this.responseString);

	// function to request match data
	requestMatch() {
		// change dataType to match so that the page displays the match table
		console.log(this.data);
		this.dataType = "match";
		// initialize variables
		var _responseString
		var xhr = new XMLHttpRequest();
		// use POST method to /api/readmatch as synchronous
		xhr.open("POST", '/api/readmatch', false);
		//Send the proper header information along with the request
		xhr.setRequestHeader("Content-type", "text/plain");
		xhr.onreadystatechange = function () {
			//Call a function when the state changes.
			if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
				// set _responseString equal to whatever the server returns, 
				// if a 200 is returned for the POST
				_responseString = xhr.responseText;
			}
			_responseString = xhr.responseText;
		}
		// send the POST request
		xhr.send(this.requestPayload);
		// set a global variable to the response string, this is parsed earlier
		this.responseString = _responseString;
//		alert("response variable: " + this.responseString);
	}
	// function to request team data
	requestTeam() {
		// change dataType to match so that the page displays the team table
		console.log(this.data);
		this.dataType = "team";
		// initialize variables
		var _responseString
		var xhr = new XMLHttpRequest();
		// use POST method to /api/readteam as synchronous
		xhr.open("POST", '/api/readteam', false);
		//Send the proper header information along with the request
		xhr.setRequestHeader("Content-type", "text/plain");
		xhr.onreadystatechange = function () {
			//Call a function when the state changes.
			if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
				// set _responseString equal to whatever the server returns, 
				// if a 200 is returned for the POST
				_responseString = xhr.responseText;
			}
			_responseString = xhr.responseText;
		}
		// send the POST request
		xhr.send(this.requestPayload);
		// set a global variable to the response string, this is parsed earlier
		this.responseString = _responseString;
//		alert("response variable: " + this.responseString);
	}
	constructor() { }
	ngOnInit() { }
}
