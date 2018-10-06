import { Component } from '@angular/core';
import { PlatformLocation } from '@angular/common'
import { SwUpdate } from '@angular/service-worker';
import { interval } from 'rxjs';
import { QuestionService } from './question.service';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../environments/environment';

import {PayloadStoreService} from './payload-store.service';

import { ToastrService } from 'ngx-toastr';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css'],
	providers:  [QuestionService]
})

export class AppComponent {
	setupQuestions: any[];
	autoQuestions: any[];
	teleopQuestions: any[];
	endgameQuestions: any[];

	title = 'StrangeScout';
	year = '2018';
	game = 'Power Up';

	visiblePage = 'splash';

	scouter: string;
	team: number;
	run: number;

	storeLength: number;

	constructor(private toastr: ToastrService, private location: PlatformLocation, qservice: QuestionService, private updates: SwUpdate, private cookieService: CookieService) {

		this.setupQuestions = qservice.getSetupQuestions();
		this.autoQuestions = qservice.getAutoQuestions();
		this.teleopQuestions = qservice.getTeleopQuestions();
		this.endgameQuestions = qservice.getEndgameQuestions();

		updates.available.subscribe(event => {
			console.log('current version is', event.current);
			console.log('available version is', event.available);
			this.toastr.info('Reload for changes','Updates available!');
		});
		updates.activated.subscribe(event => {
			console.log('old version was', event.previous);
			console.log('new version is', event.current);
		});
		interval(30000).subscribe(() => updates.checkForUpdate());

		if(cookieService.get('scouter') == '') {
			do {
				this.scouter = window.prompt("Enter scouter name:");
			} while(this.scouter == null || this.scouter == "" );
			var expiredDate = new Date();
			expiredDate.setDate( expiredDate.getDate() + 3 );
			cookieService.set('scouter', this.scouter, expiredDate, "/", environment.domain);
		} else {
			this.scouter = cookieService.get('scouter')
		}

		window.addEventListener('cachecomplete', function (e) {
			console.log('event')
			// @ts-ignore
			if (e.detail.success > 0) {
				// @ts-ignore
				toastr.success(`${e.detail.success} successful submission(s)`)
			}
			// @ts-ignore
			if (e.detail.duplicate > 0) {
				// @ts-ignore
				toastr.warning(`${e.detail.duplicate} duplicate(s) ignored`)
			}
			// @ts-ignore
			if (e.detail.failed > 0) {
				// @ts-ignore
				toastr.error(`${e.detail.failed} failed submission(s)`)
			}
		}, false)

		this.storeLength = localStorage.length;

	}

	submitCache() {
		PayloadStoreService.submitCache();
		this.storeLength = localStorage.length;
	}

	deleteCache() {
		if (confirm('Are you sure you want to clear cached payloads?')) {
			PayloadStoreService.deleteCache();
			this.storeLength = localStorage.length;
			this.toastr.info('Cached payloads cleared');
		}
	}

	editScouter() {
		do {
			if (this.scouter == null) {this.scouter = ""}
			this.scouter = window.prompt("Enter scouter name:", this.scouter);
		} while(this.scouter == null || this.scouter == "" );
		var expiredDate = new Date();
		expiredDate.setDate( expiredDate.getDate() + 3 );
		this.cookieService.set('scouter', this.scouter, expiredDate, "/", environment.domain);
	}

}
