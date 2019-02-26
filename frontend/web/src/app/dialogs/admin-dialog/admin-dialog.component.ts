import { Component } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

import { PouchdbService } from '../../services/pouchdb.service';

// toasts
import { ToastrService } from 'ngx-toastr';

@Component({
	selector: 'app-admin-dialog',
	templateUrl: './admin-dialog.component.html',
	styleUrls: ['./admin-dialog.component.css']
})
export class AdminDialogComponent {

	// panel state
	state: string;

	// Create User data ----------
	username = '';
	password = '';
	admin = false;
	hide = true;
	// ---------------------------

	// auth cookie timeout
	timeout: string;

	constructor(public dbs: PouchdbService, private toastr: ToastrService, public dialogRef: MatDialogRef<AdminDialogComponent>) {
		// state defaults to the main page
		this.state = 'main';

		this.dbs.getConfig('couch_httpd_auth', 'timeout').then(resolve => {
			this.timeout = JSON.parse(resolve);
		});
	}

	/**
	 * Changes the current state of the admin menu
	 * @param state value to set the state var to
	 */
	show(state: string) {
		this.state = state;
	}

	/**
	 * Creates the new user if the form is valid
	 */
	newUser() {
		const self = this;
		if (document.getElementById('createForm').classList.contains('ng-valid')) {
			self.dbs.newUser(self.username, self.password, self.admin).then(resolve => {
				console.log(resolve);
				if (resolve === 200 || 201) {
					self.toastr.success('User Created');
				} else if (resolve === 409) {
					self.toastr.error('User already exists');
				} else {
					self.toastr.error(resolve.toString(), 'ERROR');
				}
				self.dialogRef.close();
			});
		}
	}

	/**
	 * Sets the auth cookie timeout value
	 */
	setTimeout() {
		const self = this;
		if (document.getElementById('timeout').classList.contains('ng-valid')) {
			self.dbs.setConfig('couch_httpd_auth', 'timeout', self.timeout).then(resolve => {
				console.log(resolve);
				if (resolve === 200) {
					self.toastr.success('Timeout Set');
				} else {
					self.toastr.error(resolve.toString(), 'ERROR');
				}
				self.dialogRef.close();
			});
		}
	}

}
