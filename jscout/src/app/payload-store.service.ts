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
  
}
