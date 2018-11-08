import { Injectable } from '@angular/core';

import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class PayloadStoreService {

	constructor(private toastr: ToastrService) {  }

	static storePayload(payload: string) {
		for (var store=1; store <= localStorage.length; store++);
		localStorage.setItem(store.toString(),payload);
	}

	static submitCache() {

		var count = localStorage.length;

		var success = 0;
		var duplicate = 0;
		var failed = 0;

		for (var key=1; key <= localStorage.length; key++) {

			// get payload
			var payload = localStorage.getItem(key.toString());

			var xhr = new XMLHttpRequest();

			// PUT asynchronously
			xhr.open("PUT", '/api/' + JSON.parse(payload).TeamNumber + '/' + JSON.parse(payload).MatchNumber, true);
			//Send the proper header information along with the request
			xhr.setRequestHeader("Content-type", "application/json");
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
				}
				if (success + duplicate + failed == count) {
					var detail = {'success': success, 'duplicate': duplicate, 'failed': failed};
					console.log('dispatch')
					window.dispatchEvent(new CustomEvent('cachecomplete', {detail: detail}));
				}
  			}
			// send POST request
  			xhr.send(payload);
  			// debugging alerts
  				// alert(this.payload);
  				// alert(xhr.responseText);
		}
	}

	static readCache(key: number) {
		return localStorage.getItem(key.toString());
	}
	  
	static deleteCache() {
		localStorage.clear();
	}
  
}
