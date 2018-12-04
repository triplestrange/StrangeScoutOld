import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})

export class PayloadStoreService {

	// store a payload in cache
	static storePayload(payload: string) {
		for (var store=1; store <= localStorage.length; store++);
		localStorage.setItem(store.toString(),payload);
	}

	// iterate through cache and submit payloads
	static submitCache() {
		// total payloads
		var count = localStorage.length;

		// counters for status
		var success = 0;
		var duplicate = 0;
		var failed = 0;

		// loop
		for (var key=1; key <= localStorage.length; key++) {
			var xhr = new XMLHttpRequest();

			// get payload
			var payload = localStorage.getItem(key.toString());

			// PUT asynchronously
			xhr.open("PUT", '/api/team/' + JSON.parse(payload).TeamNumber + '/match/' + JSON.parse(payload).MatchNumber, true);
			//Send the proper header information along with the request
			xhr.setRequestHeader("Content-type", "application/json");
			xhr.onreadystatechange = function() {
				//Call a function when the state changes.
				if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 0) {
					alert(`Unable to contact server`);
				} else if (xhr.readyState == XMLHttpRequest.DONE && (xhr.status <= 299 || xhr.status == 409)) {
					// remove from cache if success or duplicate
					localStorage.removeItem(key.toString());
					if (xhr.status == 409) {
						duplicate++;
					} else {
						success++;
					}
				} else if (xhr.readyState == XMLHttpRequest.DONE && xhr.status >= 300) {
					failed++;
				}
				// once all have been attempted run
				if (success + duplicate + failed == count) {
					// generate string off counters
					var detail = {'success': success, 'duplicate': duplicate, 'failed': failed};
					console.log('dispatch')
					// dispatch event (handled in app component to trigger notofications)
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

	// read a cached payload
	static readCache(key: number) {
		return localStorage.getItem(key.toString());
	}

	// delete all cached payloads
	static deleteCache() {
		localStorage.clear();
	}

}
