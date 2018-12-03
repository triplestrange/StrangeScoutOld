import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';


// cookies
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class ScouterService {

	constructor(private cookieService: CookieService) { }

	scouter: string;

	loadScouter() {
		// check if there's a scouter name cookie
		if(this.cookieService.get('scouter') == '') {
			// loop to prompt for scouter name
			do {
				this.scouter = window.prompt("Enter scouter name:");
			} while(this.scouter == null || this.scouter == "" );
			// set cookie and expire after 3 days (typical competition length)
			var expiredDate = new Date();
			expiredDate.setDate( expiredDate.getDate() + 3 );
			this.cookieService.set('scouter', this.scouter, expiredDate, "/", environment.domain);
		} else {
			// load scouter name
			this.scouter = this.cookieService.get('scouter')
		}
	}

	editScouter() {
		// same loop as ^
		do {
			if (this.scouter == null) {this.scouter = ""}
			this.scouter = window.prompt("Enter scouter name:", this.scouter);
		} while(this.scouter == null || this.scouter == "" );
		var expiredDate = new Date();
		expiredDate.setDate( expiredDate.getDate() + 3 );
		this.cookieService.set('scouter', this.scouter, expiredDate, "/", environment.domain);
	}

	getScouter() {
		this.loadScouter();
		return this.scouter;
	}

}