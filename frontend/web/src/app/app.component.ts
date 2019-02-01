import { Component, OnInit } from '@angular/core';
import { environment } from '../environments/environment';

import { MatDialog } from '@angular/material';
import { LoginDialogComponent } from './dialogs/login-dialog/login-dialog.component';

import { HomeComponent } from './home/home.component'

// animations
import {trigger, transition} from '@angular/animations';
import { leftIn, rightIn } from './app-routing.animations';

// service worker stuff
import { SwUpdate } from '@angular/service-worker';
import { interval } from 'rxjs';

// toasts
import { ToastrService } from 'ngx-toastr';

// user id service
import { UserService } from './services/user.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	animations: [trigger('routerTransition', [
		// set which animation to play on view change
		transition('home => run-form', rightIn),
		transition('run-form => home', leftIn)
	])],
	styleUrls: ['./app.component.css'],
	providers: [ UserService ]
})

export class AppComponent implements OnInit {
	// base information strings
	title = 'StrangeScout';
	year = '2019';
	game = 'Deep Space';

	ngOnInit() {
		navigator.serviceWorker.register('/ngsw-worker.js');
	}

	constructor(public us: UserService, private toastr: ToastrService, private updates: SwUpdate, private dialog: MatDialog) {

		// notify of updates
		this.updates.available.subscribe(event => {
			console.log('current version is', event.current);
			console.log('available version is', event.available);
			this.toastr.info('Reload for changes', 'New version available!');
		});
		// log after updates
		this.updates.activated.subscribe(event => {
			console.log('old version was', event.previous);
			console.log('new version is', event.current);
		});
		// check for updates
		interval(30000).subscribe(() => this.updates.checkForUpdate());

		if (this.us.checkID() != true) {
			this.dialog.open(LoginDialogComponent, {disableClose: true}).afterClosed().subscribe(result => {
				window.dispatchEvent(new CustomEvent('newLogin'));
			});
		}

	}

	// get current view of a router outlet
	getState(outlet) {
		return outlet.activatedRouteData.state;
	}

}
