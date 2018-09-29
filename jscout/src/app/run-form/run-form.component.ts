import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

import { QuestionBase } from '../questions/question-base';
import { QuestionControlService } from '../question-control.service';

@Component({
	selector: 'app-run-form',
	templateUrl: './run-form.component.html',
	providers: [ QuestionControlService ]
})

export class RunFormComponent implements OnInit {

	@Input() scouter: string;
	@Input() team: number;
	@Input() run: number;

	@Input() setupQuestions: QuestionBase<any>[] = [];
	@Input() autoQuestions: QuestionBase<any>[] = [];
	@Input() teleopQuestions: QuestionBase<any>[] = [];
	@Input() endgameQuestions: QuestionBase<any>[] = [];

	form: FormGroup;
	initialization: FormGroup;
	setupForm: FormGroup;
	autoForm: FormGroup;
	teleopForm: FormGroup;
	endgameForm: FormGroup;

	// define change event
	changeEvent = new Event('change');

	constructor(private qcs: QuestionControlService) {  }

	ngOnInit() {
		this.form = new FormGroup({});
		this.initialization = new FormGroup({Scouter: new FormControl(this.scouter), TeamNumber: new FormControl(this.team), MatchNumber: new FormControl(this.run) });
		this.setupForm = this.qcs.toFormGroup(this.setupQuestions);
		this.autoForm = this.qcs.toFormGroup(this.autoQuestions);
		this.teleopForm = this.qcs.toFormGroup(this.teleopQuestions);
		this.endgameForm = this.qcs.toFormGroup(this.endgameQuestions);
	}

	get payload() {
		// get timestamp data
		var dt = new Date();
		var year = dt.getUTCFullYear();
		var month = dt.getUTCMonth() + 1;
		var day = dt.getUTCDate();
		var hour = dt.getUTCHours();
		var minute = dt.getUTCMinutes();
		var second = dt.getUTCSeconds();
		// create timestamp object
		var timestamp = {Timestamp: String(year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second)}
		// create JSON payload from all form objects
		return JSON.stringify(Object.assign({}, this.initialization.value, this.setupForm.value, this.autoForm.value, this.teleopForm.value, this.endgameForm.value, timestamp));
	}

	// submit function
	onSubmit() {
	
		var xhr = new XMLHttpRequest();
		
		if (navigator.onLine) {
			// POST to /api/submitmatch asynchronously
			xhr.open("POST", '/api/submitmatch', true);
			//Send the proper header information along with the request
			xhr.setRequestHeader("Content-type", "text/plain");
			xhr.onreadystatechange = function() {
				//Call a function when the state changes.
				if (xhr.readyState == XMLHttpRequest.DONE && (xhr.status <= 299 || xhr.status == 409)) {
					// Clear form. Data is either recorded or duplicate.
					alert(`Message from server: ${xhr.status} ${xhr.statusText} -- ${xhr.responseText}`);
					location.reload();
				} else if (xhr.readyState == XMLHttpRequest.DONE && xhr.status >= 300) {
					// Don't clear form.
					alert(`Message from server: ${xhr.status} ${xhr.statusText} -- ${xhr.responseText}`);
				}
			}
			// send POST request
			xhr.send(this.payload);
			// debugging alerts
				// alert(this.payload);
				// alert(xhr.responseText);
		} else {
			window.alert("Offline! Can't submit Data. Please reconnect to the internet.");
		}

	}
}