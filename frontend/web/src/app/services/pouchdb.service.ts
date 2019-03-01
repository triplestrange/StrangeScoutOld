import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

import { MatDialog } from '@angular/material';
import { LoginDialogComponent } from '../dialogs/login-dialog/login-dialog.component';

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

	constructor(private us: UserService, private toastr: ToastrService, private cs: CookieService, private dialog: MatDialog) { }

	/**
	 * Authenticates with the remote database
	 * @param user Username of the user to authenticate
	 * @param pass Password of the user to authenticate
	 * @param callback Function to run after authentication is complete
	 */
	authenticateRemote(user: string, pass: string, callback) {
		const xhr = new XMLHttpRequest;
		const url = 'https://db.' + environment.domain + '/_session';
		xhr.open('POST', url);
		xhr.withCredentials = true;
		xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		xhr.onreadystatechange = function() {
			// Call a function when the state changes.
			if (xhr.readyState === XMLHttpRequest.DONE) {
				callback(xhr.status);
			}
		}
		const URIuser = encodeURIComponent(user);
		const URIpass = encodeURIComponent(pass);
		const URIdata = `name=${URIuser}&password=${URIpass}`;
		xhr.send(URIdata);
	}

	/**
	 * Deauthenticates with the remote database
	 */
	deauthenticateRemote() {
		const xhr = new XMLHttpRequest;
		const url = 'https://db.' + environment.domain + '/_session';
		xhr.withCredentials = true;
		xhr.open('DELETE', url);
		xhr.send();
	}

	/**
	 * Stores a document in the local database
	 * @param doc Object to be stored
	 */
	storeLocal(doc: {}) {
		const localDB = new PouchDB('ssdb');
		localDB.put(doc);
		console.log(localDB.info());
	}

	/**
	 * Syncs the local database with the remote database
	 */
	syncRemote() {
		const self = this;

		const remoteURL = 'https://db.' + environment.domain + '/ssdb';
		const localDB = new PouchDB('ssdb');
		const remoteDB = new PouchDB(remoteURL, {
			adapter: 'http',
			fetch: (url, opts) => {
				opts.credentials = 'include';
				return PouchDB.fetch(url, opts);
			}
		});
		
		const xhr = new XMLHttpRequest;
		const url = 'https://db.' + environment.domain + '/_session';
		xhr.open('GET', url);
		xhr.withCredentials = true;
		xhr.onreadystatechange = function() {
			// Call a function when the state changes.
			if (xhr.readyState === XMLHttpRequest.DONE) {
				if (JSON.parse(xhr.responseText).userCtx.name === null) {
					self.dialog.open(LoginDialogComponent, {disableClose: true}).afterClosed().subscribe(result => {
						window.dispatchEvent(new CustomEvent('newLogin'));
						localDB.sync(remoteDB).on('complete', function () {
							self.toastr.success('Data synced');
							console.log(localDB.info());
						}).on('error', function (err) {
							self.toastr.error('Error syncing data!');
							console.log(err);
						});
					});
				} else {
					localDB.sync(remoteDB).on('complete', function () {
						self.toastr.success('Data synced');
						console.log(localDB.info());
					}).on('error', function (err) {
						self.toastr.error('Error syncing data!');
						console.log(err);
					});
				}
			}
		}
		xhr.send();
	}

	/**
	 * Deletes the local database
	 */
	deleteLocal() {
		const localDB = new PouchDB('ssdb');
		localDB.destroy();
	}

	/**
	 * Returns a promise that resolves true if the current user is an admin, else false
	 */
	isAdmin(): Promise<boolean> {
		return new Promise(resolve => {
			const xhr = new XMLHttpRequest;
			const url = 'https://db.' + environment.domain + '/_session';
			xhr.open('GET', url);
			xhr.withCredentials = true;
			xhr.onreadystatechange = function() {
				// Call a function when the state changes.
				if (xhr.readyState === XMLHttpRequest.DONE) {
					const res = JSON.parse(xhr.responseText);
					if (res.userCtx.roles.includes('_admin')) {
						console.log('admin');
						resolve(true);
					} else {
						console.log('notadmin');
						resolve(false);
					}
				}
			}
			xhr.send();
		});
	}

	/**
	 * Creates a new database user
	 * @param user New user username
	 * @param pass New user password
	 * @param admin Is the new user an admin
	 */
	newUser(user: string, pass: string, admin: boolean): Promise<number> {
		if (admin) {
			// create a new admin user
			return new Promise(resolve => {
				const xhr = new XMLHttpRequest;
				const url = `https://db.${environment.domain}/_node/node1@127.0.0.1/_config/admins/${user}`;
				xhr.open('PUT', url);
				xhr.withCredentials = true;
				xhr.onreadystatechange = function() {
					// Call a function when the state changes.
					if (xhr.readyState === XMLHttpRequest.DONE) {
						resolve(xhr.status);
					}
				}
				xhr.send(`"${pass}"`);
			});
		} else {
			// create a regular user
			return new Promise(resolve => {
				const xhr = new XMLHttpRequest;
				const url = `https://db.${environment.domain}/_users/org.couchdb.user:${user}`;
				const newuser = {
					_id: `org.couchdb.user:${user}`,
					name: user,
					password: pass,
					roles: ['scouter'],
					type: 'user'
				};
				xhr.open('PUT', url);
				xhr.withCredentials = true;
				xhr.setRequestHeader('Content-type', 'application/json');
				xhr.onreadystatechange = function() {
					// Call a function when the state changes.
					if (xhr.readyState === XMLHttpRequest.DONE) {
						resolve(xhr.status);
					}
				}
				xhr.send(JSON.stringify(newuser));
			});
		}
	}

	/**
	 * Sets a database configuration value
	 * @param section Config section
	 * @param option Config option
	 * @param value Option value
	 */
	setConfig(section: string, option: string, value: string): Promise<number> {
		return new Promise(resolve => {
			const xhr = new XMLHttpRequest;
			const url = `https://db.${environment.domain}/_node/node1@127.0.0.1/_config/${section}/${option}`;
			xhr.open('PUT', url);
			xhr.withCredentials = true;
			xhr.onreadystatechange = function() {
				// Call a function when the state changes.
				if (xhr.readyState === XMLHttpRequest.DONE) {
					resolve(xhr.status);
				}
			}
			xhr.send(`"${value}"`);
		});
	}

	/**
	 * Gets a database configuration value
	 * @param section Config section
	 * @param option Config option
	 */
	getConfig(section: string, option: string): Promise<string> {
		return new Promise(resolve => {
			const xhr = new XMLHttpRequest;
			const url = `https://db.${environment.domain}/_node/node1@127.0.0.1/_config/${section}/${option}`;
			xhr.open('GET', url);
			xhr.withCredentials = true;
			xhr.onreadystatechange = function() {
				// Call a function when the state changes.
				if (xhr.readyState === XMLHttpRequest.DONE) {
					resolve(xhr.responseText);
				}
			}
			xhr.send();
		});
	}

}
