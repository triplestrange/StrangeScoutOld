import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

// toasts
import { ToastrService } from 'ngx-toastr';

import { UserService } from './user.service';

import { CookieService } from 'ngx-cookie-service';

// @ts-ignore
import PouchDB from 'pouchdb'

@Injectable({
  providedIn: 'root'
})
export class PouchdbService {

	constructor(private us: UserService, private toastr: ToastrService, private cs: CookieService) { }

	authenticateRemote(user: string, pass: string, callback) {
		const xhr = new XMLHttpRequest;
		const url = '/db/_session'
		xhr.open('POST', url)
		xhr.withCredentials = true;
		xhr.setRequestHeader('Content-type', 'application/json');
		xhr.onreadystatechange = function() {
			// Call a function when the state changes.
			if (xhr.readyState === XMLHttpRequest.DONE) {
				callback(xhr.status);
			}
		}
		xhr.send(JSON.stringify({"name": user, "password": pass}));
	}

	deauthenticateRemote() {
		const xhr = new XMLHttpRequest;
		const url = '/db/_session'
		xhr.withCredentials = true;
		xhr.open('DELETE', url)
		xhr.send()
	}

	// store doc in local db
	storeLocal(doc) {
		const localDB = new PouchDB('ssdb')
		localDB.put(doc)
		console.log(localDB.info())
	}

	// sync with remote db
	syncRemote() {
		const self = this;
		const remoteURL = 'https://'+environment.domain+'/db/ssdb'
		const localDB = new PouchDB('ssdb')
		const remoteDB = new PouchDB(remoteURL, {
			adapter: "http",
			fetch: (url, opts) => {
				opts.credentials = 'include';
				return PouchDB.fetch(url, opts);
			},
		})

		localDB.sync(remoteDB).on('complete', function () {
			self.toastr.success('Data synced');
			console.log(localDB.info());
		}).on('error', function (err) {
			self.toastr.error('Error syncing data!');
			console.log(err);
		});
	}

	deleteLocal() {
		const localDB = new PouchDB('ssdb');
		localDB.destroy();
	}
}
