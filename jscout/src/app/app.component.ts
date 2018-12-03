import { Component, OnInit } from '@angular/core';
import { environment } from '../environments/environment';

// service worker stuff
import { SwUpdate } from '@angular/service-worker';
import { interval } from 'rxjs';

// toasts
import { ToastrService } from 'ngx-toastr';

// scouter id service
import { ScouterService } from './scouter.service';

import { routerTransition } from './app-routing.animations';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	animations: [ routerTransition ],
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

	ngOnInit() {
		navigator.serviceWorker.register('/ngsw-worker.js')
	}

	constructor(private ss: ScouterService, private toastr: ToastrService, private updates: SwUpdate) {
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
	}

	getState(outlet) {
		return outlet.activatedRouteData.state;
	}

}
