import { Component }       from '@angular/core';

import { QuestionService } from './question.service';

import { SwUpdate } from '@angular/service-worker';

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

  swUpdate: SwUpdate;

  constructor(service: QuestionService) {
    this.setupQuestions = service.getSetupQuestions();
    this.autoQuestions = service.getAutoQuestions();
    this.teleopQuestions = service.getTeleopQuestions();
    this.endgameQuestions = service.getEndgameQuestions();
  }


  
  ngOnInit () {
    if (this.swUpdate.isEnabled) {

      this.swUpdate.available.subscribe(() => {

          if(confirm("New version available. Load New Version?")) {

              window.location.reload();
          }
      });
    }
  }
}
