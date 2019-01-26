import { Injectable } from '@angular/core';

// toasts
import { ToastrService } from 'ngx-toastr';

@Injectable({
	providedIn: 'root'
})
export class NotificationsService {

	constructor(private toastr: ToastrService) {	}

	runFormListeners() {
		var self = this;
		// submission notifications
		window.addEventListener('submitcached', function (e) {
			self.toastr.warning('Data cached', 'Unable to contact server');
		});
		window.addEventListener('submitsuccess', function (e) {
			self.toastr.success('Data successfully submitted!');
		});
		window.addEventListener('submitduplicate', function (e) {
			self.toastr.warning('Duplicate data not recorded');
		});
		window.addEventListener('submiterror', function (e) {
			// @ts-ignore
			self.toastr.error(e.detail, 'ERROR');
		});
	}

	cacheManagementListeners() {
		var self = this;
		// listener for completion of cache submissions
		window.addEventListener('cachecomplete', function (e) {
			console.log('event');
			// @ts-ignore
			if (e.detail.success > 0) {
				// @ts-ignore
				self.toastr.success(`${e.detail.success} successful submission(s)`);
			}
			// @ts-ignore
			if (e.detail.duplicate > 0) {
				// @ts-ignore
				self.toastr.warning(`${e.detail.duplicate} duplicate(s) ignored`);
			}
			// @ts-ignore
			if (e.detail.failed > 0) {
				// @ts-ignore
				self.toastr.error(`${e.detail.failed} failed submission(s)`);
			}
		});
	}
}
