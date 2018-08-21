import { Injectable }   from '@angular/core';
import { interval } from 'rxjs';
import { SwUpdate } from '@angular/service-worker';

@Injectable()

export class PromptUpdateService {
  updates: SwUpdate
  constructor() {
    if (this.updates.isEnabled) {
      this.updates.available.subscribe(() => {
        if(confirm("New version available. Load New Version?")) {
          window.location.reload();
        }
      });
    }
  }
}

export class LogUpdateService {
  updates: SwUpdate
  constructor() {
    this.updates.available.subscribe(event => {
      console.log('current version is', event.current);
      console.log('available version is', event.available);
    });
    this.updates.activated.subscribe(event => {
      console.log('old version was', event.previous);
      console.log('new version is', event.current);
    });
  }
}

export class CheckForUpdateService {
  updates: SwUpdate
  constructor() {
    interval(6 * 60 * 60).subscribe(() => this.updates.checkForUpdate());
  }
}