import { Component, OnInit } from '@angular/core';
import { environment } from '../environments/environment';

// animations
import {trigger, transition} from '@angular/animations';
import { leftIn, rightIn } from './app-routing.animations';

// service worker stuff
import { SwUpdate } from '@angular/service-worker';
import { interval } from 'rxjs';

// toasts
import { ToastrService } from 'ngx-toastr';

// scouter id service
import { ScouterService } from './scouter.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	animations: [trigger('routerTransition', [
		// set which animation to play on view change
		transition('home => cache-management', leftIn),
		transition('home => data', leftIn),
		transition('home => run-form', rightIn),
		transition('cache-management => home', rightIn),
		transition('data => home', rightIn),
		transition('run-form => home', leftIn)
	])],
	styleUrls: ['./app.component.css'],
	providers: [ ScouterService ]
})

export class AppComponent implements OnInit {
	// base information strings
	title = 'StrangeScout';
	year = '2019';
	game = 'Deep Space';

	// string for the scouter name
	scouter: string;

	ngOnInit() {
		navigator.serviceWorker.register('/ngsw-worker.js');
	}

	constructor(private ss: ScouterService, private toastr: ToastrService, private updates: SwUpdate) {
		// notify of updates
		this.updates.available.subscribe(event => {
			console.log('current version is', event.current);
			console.log('available version is', event.available);
			this.toastr.info('Reload for changes', 'Updates available!');
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

	// get current view of a router outlet
	getState(outlet) {
		return outlet.activatedRouteData.state;
	}

}
