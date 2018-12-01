import { Component } from '@angular/core';

import { SwUpdate } from '@angular/service-worker';
import { interval } from 'rxjs';

import { CookieService } from 'ngx-cookie-service';

import { environment } from '../environments/environment';

import { ToastrService } from 'ngx-toastr';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})

export class AppComponent {
	// base information strings
	title = 'StrangeScout';
	year = '2018';
	game = 'Power Up';

	// string for the scouter name
	scouter: string;

	// counter for the items in cache
	storeLength: number;

	constructor(private toastr: ToastrService, private updates: SwUpdate, private cookieService: CookieService) {
		// notify of updates
		this.updates.available.subscribe(event => {
			console.log('current version is', event.current);
			console.log('available version is', event.available);
			this.toastr.info('Reload for changes','Updates available!');
		});
		// log after updates
		this.updates.activated.subscribe(event => {
			console.log('old version was', event.previous);
			console.log('new version is', event.current);
		});
		// check for updates
		interval(30000).subscribe(() => this.updates.checkForUpdate());

		// check if there's a scouter name cookie
		if(cookieService.get('scouter') == '') {
			// loop to prompt for scouter name
			do {
				this.scouter = window.prompt("Enter scouter name:");
			} while(this.scouter == null || this.scouter == "" );
			// set cookie and expire after 3 days (typical competition length)
			var expiredDate = new Date();
			expiredDate.setDate( expiredDate.getDate() + 3 );
			cookieService.set('scouter', this.scouter, expiredDate, "/", environment.domain);
		} else {
			// load scouter name
			this.scouter = cookieService.get('scouter')
		}

		// listener for completion of cache submissions
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

		// set store length
		this.storeLength = localStorage.length;

	}

	editScouter() {
		// same loop as ^
		do {
			if (this.scouter == null) {this.scouter = ""}
			this.scouter = window.prompt("Enter scouter name:", this.scouter);
		} while(this.scouter == null || this.scouter == "" );
		var expiredDate = new Date();
		expiredDate.setDate( expiredDate.getDate() + 3 );
		this.cookieService.set('scouter', this.scouter, expiredDate, "/", environment.domain);
	}

}
