import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';

import { MatDialog } from '@angular/material';
import { LoginDialogComponent } from '../login-dialog/login-dialog.component';

import { UserService } from '../user.service';
import { PouchdbService } from '../pouchdb.service';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.css'],
	providers: [ UserService ]
})
export class HomeComponent implements OnInit {

	constructor(private us: UserService, private dialog: MatDialog, public dbs: PouchdbService) {
		var self = this;
		window.addEventListener('newScouterID', function(e) {
			self.scouter = self.us.getID();
		})
	}

	scouter = this.us.getID();
	version = environment.version;

	login() {
		this.dialog.open(LoginDialogComponent, {disableClose: true}).afterClosed().subscribe(result => {
			window.dispatchEvent(new CustomEvent('newScouterID'));
		});
	}

	ngOnInit() {}

}
