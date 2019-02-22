import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';

import { MatDialog } from '@angular/material';
import { LoginDialogComponent } from '../dialogs/login-dialog/login-dialog.component';
import { ConfirmDialogComponent } from '../dialogs/confirm-dialog/confirm-dialog.component';

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
		var self = this;
		window.addEventListener('newLogin', function(e) {
			self.scouter = self.us.getID();
			self.dbs.isAdmin().then(result => {
				self.isAdmin = result;
			});
		})
		this.dbs.isAdmin().then(result => {
			self.isAdmin = result;
		});
	}

	scouter = this.us.getID();
	version = environment.version;

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

	ngOnInit() {}

}
