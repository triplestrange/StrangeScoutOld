import { Injectable }   from '@angular/core';
import { interval } from 'rxjs';
import { SwUpdate } from '@angular/service-worker';

@Injectable()

export class PromptUpdateService {

  constructor(updates: SwUpdate) {
    updates.available.subscribe(event => {
        if(confirm("New version available. Load New Version?")) {
            window.location.reload();
        }
    });
  }
}

export class LogUpdateService {

  constructor(updates: SwUpdate) {
    updates.available.subscribe(event => {
      console.log('current version is', event.current);
      console.log('available version is', event.available);
    });
    updates.activated.subscribe(event => {
      console.log('old version was', event.previous);
      console.log('new version is', event.current);
    });
  }
}

export class CheckForUpdateService {

  constructor(updates: SwUpdate) {
    interval(6 * 60 * 60).subscribe(() => updates.checkForUpdate());
  }
}