import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';

// toasts
import { ToastrService } from 'ngx-toastr';

import { PouchdbService } from '../../services/pouchdb.service';
import { UserService } from '../../services/user.service';

@Component({
	selector: 'app-login-dialog',
	templateUrl: './login-dialog.component.html',
	styleUrls: ['./login-dialog.component.css']
})
export class LoginDialogComponent {

	username: string;
	password: string;

	hide = true;

	constructor (
		public dialogRef: MatDialogRef<LoginDialogComponent>,
		private dbs: PouchdbService,
		private us: UserService,
		private toastr: ToastrService
	) {
		this.password = '';
		if (this.us.checkID()) {
			this.username = this.us.getID();
		} else {
			this.username = '';
		}
	}

	/**
	 * Authenticates with the remote database and gives a status notification
	 */
	login() {
		const self = this;
		this.dbs.authenticateRemote(this.username, this.password, function(response) {
			if (response === 200) {
				self.us.setID(self.username);
				self.dialogRef.close();
				self.toastr.success('Logged In');
			} else if (response === 401) {
				self.toastr.error('Invalid Credentials');
			} else if (response === 0) {
				self.toastr.error('No connection to server');
			} else {
				self.toastr.error(`Status Code: ${response}`, 'Unknown Error');
			}
		});
	}

}
