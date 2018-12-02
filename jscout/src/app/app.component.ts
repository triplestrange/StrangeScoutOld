import { Component, OnInit } from '@angular/core';
import { environment } from '../environments/environment';

// service worker stuff
import { SwUpdate } from '@angular/service-worker';
import { interval } from 'rxjs';

// cookies
import { CookieService } from 'ngx-cookie-service';

// toasts
import { ToastrService } from 'ngx-toastr';

// cache service
import { PayloadStoreService } from './payload-store.service';

// scouter id service
import { ScouterService } from './scouter.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: [],
	providers: [ ScouterService ]
})

export class AppComponent implements OnInit {
	// base information strings
	title = 'StrangeScout';
	year = '2018';
	game = 'Power Up';

	// string for the scouter name
	scouter: string;

	// counter for the items in cache
	storeLength: number;

	ngOnInit() {
		navigator.serviceWorker.register('/ngsw-worker.js')
	}

	constructor(private ss: ScouterService, private toastr: ToastrService, private updates: SwUpdate, private cookieService: CookieService) {
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

		// check for and load scouter ID
		ss.loadScouter();

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

	// submit cached payloads
	submitCache() {
		PayloadStoreService.submitCache();
		this.storeLength = localStorage.length;
	}

	// clear cached payloads
	deleteCache() {
		if (confirm('Are you sure you want to clear cached payloads?')) {
			PayloadStoreService.deleteCache();
			this.storeLength = localStorage.length;
			this.toastr.info('Cached payloads cleared');
		}
	}

}
