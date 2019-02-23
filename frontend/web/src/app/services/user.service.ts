import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

// cookies
import { CookieService } from 'ngx-cookie-service';

@Injectable({
	providedIn: 'root'
})
export class UserService {

	constructor(private cs: CookieService) { }

	/**
	 * Checks if a user ID is set
	 * @returns boolean
	 */
	checkID(): boolean {
		if (this.cs.get('scouter') === '') {
			return false
		} else {
			return true
		}
	}

	/**
	 * Sets the user ID cookie to `name`
	 * @param name 
	 */
	setID(name: string) {
		console.log(`setting ${name}`)
		// set cookie and expire after 3 days (typical competition length)
		const expiredDate = new Date();
		expiredDate.setDate( expiredDate.getDate() + 3 );
		this.cs.set('scouter', name, expiredDate, '/', environment.domain);
	}

	/**
	 * Returns the user ID
	 * @returns string
	 */
	getID(): string {
		return this.cs.get('scouter')
	}

	/**
	 * Deletes the user ID
	 */
	clear() {
		this.cs.delete('scouter', '/', environment.domain);
	}

}
