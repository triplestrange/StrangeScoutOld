import { Component } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { interval } from 'rxjs';
import { QuestionService } from './question.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers:  [QuestionService]
})
export class AppComponent {
  setupQuestions: any[];
  autoQuestions: any[];
  teleopQuestions: any[];
  endgameQuestions: any[];

  title = 'StrangeScout';
  year = '2018';
  game = 'Power Up';

  visiblePage = 'splash';

  constructor(qservice: QuestionService, updates: SwUpdate) {
    this.setupQuestions = qservice.getSetupQuestions();
    this.autoQuestions = qservice.getAutoQuestions();
    this.teleopQuestions = qservice.getTeleopQuestions();
    this.endgameQuestions = qservice.getEndgameQuestions();

    updates.available.subscribe(event => {
      console.log('current version is', event.current);
      console.log('available version is', event.available);
      if(confirm("New version available. Load New Version?")) {
        window.location.reload();
      }
    });
    updates.activated.subscribe(event => {
      console.log('old version was', event.previous);
      console.log('new version is', event.current);
    });
    updates.activated.subscribe(event => {
      console.log('old version was', event.previous);
      console.log('new version is', event.current);
    });
    interval(30000).subscribe(() => updates.checkForUpdate());
  }

}
