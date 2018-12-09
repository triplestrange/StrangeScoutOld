import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AppComponent } from '../app.component';

// toasts
import { ToastrService } from 'ngx-toastr';

// questions
import { QuestionBase } from '../question-types/question-base';
import { QuestionControlService } from '../question-control.service';

// cache service
import { PayloadStoreService } from '../payload-store.service';

// scouter id service
import { ScouterService } from '../scouter.service';

// questions
import { QuestionService } from '../question.service';

@Component({
	selector: 'app-run-form',
	templateUrl: './run-form.component.html',
	styleUrls: ['./run-form.component.css'],
	providers: [ ScouterService, QuestionControlService, QuestionService ]
})
export class RunFormComponent implements OnInit {

	setupQuestions = this.qservice.getSetupQuestions();
	autoQuestions = this.qservice.getAutoQuestions();
	teleopQuestions = this.qservice.getTeleopQuestions();
	endgameQuestions = this.qservice.getEndgameQuestions();

	runForm: FormGroup;
	setupForm: FormGroup;
	autoForm: FormGroup;
	teleopForm: FormGroup;
	endgameForm: FormGroup;

	// define change event
	changeEvent = new Event('change');

	constructor(private ss: ScouterService, private qcs: QuestionControlService, private toastr: ToastrService, private qservice: QuestionService) {
		// listeners to trigger notifications
		window.addEventListener('submitcached', function (e) {
			toastr.warning('Data cached', 'Unable to contact server');
		});
		window.addEventListener('submitsuccess', function (e) {
			toastr.success('Data successfully submitted!');
		});
		window.addEventListener('submitduplicate', function (e) {
			toastr.warning('Duplicate data not recorded');
		});
		window.addEventListener('submiterror', function (e) {
			// @ts-ignore
			toastr.error(e.detail, 'ERROR');
		});
	}

	ngOnInit() {
		this.runForm = new FormGroup({});
		// set form groups using QuestionControlService to convert question sets to form groups
		this.setupForm = this.qcs.toFormGroup(this.setupQuestions);
		this.autoForm = this.qcs.toFormGroup(this.autoQuestions);
		this.teleopForm = this.qcs.toFormGroup(this.teleopQuestions);
		this.endgameForm = this.qcs.toFormGroup(this.endgameQuestions);
	}

	get payload() {
		// get timestamp data
		const dt = new Date();
		const year = dt.getUTCFullYear();
		const month = dt.getUTCMonth() + 1;
		const day = dt.getUTCDate();
		const hour = dt.getUTCHours();
		const minute = dt.getUTCMinutes();
		const second = dt.getUTCSeconds();
		// create timestamp object
		const timestamp = { Timestamp: String(year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second) };
		// get scouter
		const scouter = { Scouter: this.ss.getScouter() };
		// create JSON payload from all form objects
		return JSON.stringify(
			this.removeFalsy(
				Object.assign({}, this.setupForm.value, this.autoForm.value, this.teleopForm.value, this.endgameForm.value, timestamp, scouter)
				)
			);
	}

	// removes nulls from object
	removeFalsy = (obj) => {
		const newObj = {};
		Object.keys(obj).forEach((prop) => {
			if (obj[prop]) { newObj[prop] = obj[prop]; }
		});
		return newObj;
	}

	// submit function
	onSubmit() {
		// we have to set a variable to payload because it's impossible to cal `this.payload` within the `onreadystatechange` function
		// use this value for all operations, even if you can access `this.payload` (ex. `xhr.send`)
		const payload = this.payload;

		const xhr = new XMLHttpRequest();

		// PUT asynchronously
		xhr.open('PUT', '/api/team/' + this.setupForm.value.TeamNumber + '/match/' + this.setupForm.value.MatchNumber, true);
		// Send the proper header information along with the request
		xhr.setRequestHeader('Content-type', 'application/json');
		xhr.onreadystatechange = function() {
			// Call a function when the state changes.
			if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 0) {
				// cache if no contact
				PayloadStoreService.storePayload(payload);
				window.dispatchEvent(new CustomEvent('submitcached'));
			} else if (xhr.readyState === XMLHttpRequest.DONE && xhr.status <= 299) {
				// success
				window.dispatchEvent(new CustomEvent('submitsuccess'));
			} else if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 409) {
				// duplicate
				window.dispatchEvent(new CustomEvent('submitduplicate'));
			} else if (xhr.readyState === XMLHttpRequest.DONE && xhr.status >= 300) {
				// set server response on error
				const serverresponse = `${xhr.status} ${xhr.statusText} -- ${xhr.responseText}`;
				window.dispatchEvent(new CustomEvent('submiterror', {detail: serverresponse}));
				// also cache response
				PayloadStoreService.storePayload(payload);
				window.dispatchEvent(new CustomEvent('submitcached'));
			}
		};
		// send POST request
		xhr.send(payload);
		// debugging alerts
			// alert(this.payload);
			// alert(xhr.responseText);
	}

}
