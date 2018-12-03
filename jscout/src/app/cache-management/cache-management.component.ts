import { Component, OnInit } from '@angular/core';

// cache service
import { PayloadStoreService } from '../payload-store.service';

// toasts
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cache-management',
  templateUrl: './cache-management.component.html',
  styleUrls: ['./cache-management.component.css']
})
export class CacheManagementComponent {

	// counter for the items in cache
	storeLength: number;

	constructor(private toastr: ToastrService) {
		// set store length
		this.storeLength = localStorage.length;

		// listener for completion of cache submissions
		window.addEventListener('cachecomplete', function (e) {
			console.log('event')
			// @ts-ignore
			if (e.detail.success > 0) {
				// @ts-ignore
				toastr.success(`${e.detail.success} successful submission(s)`)
			}
			// @ts-ignore
			if (e.detail.duplicate > 0) {
				// @ts-ignore
				toastr.warning(`${e.detail.duplicate} duplicate(s) ignored`)
			}
			// @ts-ignore
			if (e.detail.failed > 0) {
				// @ts-ignore
				toastr.error(`${e.detail.failed} failed submission(s)`)
			}
		})
	}

	// submit cached payloads
	submitCache() {
		PayloadStoreService.submitCache();
		this.storeLength = localStorage.length;
	}

	// clear cached payloads
	deleteCache() {
		if (confirm('Are you sure you want to clear cached payloads?')) {
			PayloadStoreService.deleteCache();
			this.storeLength = localStorage.length;
			this.toastr.info('Cached payloads cleared');
		}
	}

}
