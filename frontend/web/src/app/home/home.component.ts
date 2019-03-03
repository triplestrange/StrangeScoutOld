import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';

import { MatDialog } from '@angular/material';
import { LoginDialogComponent } from '../dialogs/login-dialog/login-dialog.component';
import { ConfirmDialogComponent } from '../dialogs/confirm-dialog/confirm-dialog.component';
import { AdminDialogComponent } from '../dialogs/admin-dialog/admin-dialog.component';

import { UserService } from '../services/user.service';
import { PouchdbService } from '../services/pouchdb.service';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.css'],
	providers: [ UserService ]
})
export class HomeComponent implements OnInit {

	isAdmin: boolean;

	constructor(private us: UserService, private dialog: MatDialog, public dbs: PouchdbService) {
		const self = this;

		window.addEventListener('newLogin', function(e) {
			self.scouter = self.us.getID();
			self.dbs.isAdmin().then(result => {
				self.isAdmin = result;
			});
		});

		this.dbs.isAdmin().then(result => {
			self.isAdmin = result;
		});
	}

	scouter = this.us.getID();
	version = environment.version;

	/**
	 * Opens the logout confirm dialog
	 *
	 * On confirm deletes local database and clears the user ID cookie
	 */
	logout() {
		this.dialog.open(ConfirmDialogComponent, {disableClose: true}).afterClosed().subscribe(result => {
			if ( result ) {
				this.us.clear();
				this.dbs.deleteLocal();
				this.dialog.open(LoginDialogComponent, {disableClose: true}).afterClosed().subscribe(result => {
					window.dispatchEvent(new CustomEvent('newLogin'));
				});
			}
		});
	}

	/**
	 * Opens the admin panel
	 */
	adminMenu() {
		this.dialog.open(AdminDialogComponent, {width: '250px', autoFocus: false}).afterClosed().subscribe(result => {});
	}

	syncData() {
		const self = this;
		const xhr = new XMLHttpRequest;
		const url = `${location.protocol}//db.${window.location.host}/_session`;
		xhr.open('GET', url);
		xhr.withCredentials = true;
		xhr.onreadystatechange = function() {
			// Call a function when the state changes.
			if (xhr.readyState === XMLHttpRequest.DONE) {
				if (JSON.parse(xhr.responseText).userCtx.name === null) {
					self.dialog.open(LoginDialogComponent, {disableClose: true}).afterClosed().subscribe(result => {
						window.dispatchEvent(new CustomEvent('newLogin'));
						self.dbs.syncRemote();
					});
				} else {
					self.dbs.syncRemote();
				}
			}
		}
		xhr.send();
	}

	ngOnInit() {}

}
