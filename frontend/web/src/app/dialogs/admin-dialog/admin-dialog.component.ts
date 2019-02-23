import { Component } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

import { PouchdbService } from '../../services/pouchdb.service';

@Component({
	selector: 'app-admin-dialog',
	templateUrl: './admin-dialog.component.html',
	styleUrls: ['./admin-dialog.component.css']
})
export class AdminDialogComponent {

	// panel state
	state: string

	// Create User data ----------
	username = ""
	password = ""
	admin = false
	hide = true
	// ---------------------------

	constructor(public dbs: PouchdbService, public dialogRef: MatDialogRef<AdminDialogComponent>) {
		// state defaults to the main page
		this.state = 'main';
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
				
			});
		}
	}

}
