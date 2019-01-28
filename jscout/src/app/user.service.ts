import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

// cookies
import { CookieService } from 'ngx-cookie-service';

@Injectable({
	providedIn: 'root'
})
export class UserService {

	constructor(private cs: CookieService) { }

	checkID() {
		if (this.cs.get('scouter') === '') {
			return false
		} else {
			return true
		}
	}

	setID(name) {
		// set cookie and expire after 3 days (typical competition length)
		const expiredDate = new Date();
		expiredDate.setDate( expiredDate.getDate() + 3 );
		this.cs.set('scouter', name, expiredDate, '/', environment.domain);
	}

	getID() {
		return this.cs.get('scouter')
	}

}
