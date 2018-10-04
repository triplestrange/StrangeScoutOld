import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PayloadStoreService {

	constructor() { }

	static storePayload(payload: string) {
		for (var store=1; store <= localStorage.length; store++);
		localStorage.setItem(store.toString(),payload);
	}

	static submitCache() {

		var success = 0;
		var duplicate = 0;
		var failed = 0;

		for (var key=1; key <= localStorage.length; key++) {
			// get payload
			var payload = localStorage.getItem(key.toString());

			var xhr = new XMLHttpRequest();
			// POST to /api/submitmatch asynchronously
			xhr.open("POST", '/api/submitmatch', true);
			//Send the proper header information along with the request
			xhr.setRequestHeader("Content-type", "text/plain");
			xhr.onreadystatechange = function() {
				//Call a function when the state changes.
				if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 0) {
					alert(`Unable to contact server`);
  				} else if (xhr.readyState == XMLHttpRequest.DONE && (xhr.status <= 299 || xhr.status == 409)) {
					localStorage.removeItem(key.toString());
					if (xhr.status == 409) {
						duplicate++;
					} else {
						success++;
					}
  				} else if (xhr.readyState == XMLHttpRequest.DONE && xhr.status >= 300) {
  					failed++;
  					alert(`Message from server: ${xhr.status} ${xhr.statusText} -- ${xhr.responseText}`);
  				}
  			}
			// send POST request
  			xhr.send(payload);
  			// debugging alerts
  				// alert(this.payload);
  				// alert(xhr.responseText);
		}
		
		alert(`Successfully submitted ${success} payload(s)\nDidn't submit ${duplicate} duplicate(s)`);
	}

	static readCache(key: number) {
		return localStorage.getItem(key.toString());
  	}
  
}
