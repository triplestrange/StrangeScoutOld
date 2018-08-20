import { Component }       from '@angular/core';

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

  constructor(service: QuestionService) {
    this.setupQuestions = service.getSetupQuestions();
    this.autoQuestions = service.getAutoQuestions();
    this.teleopQuestions = service.getTeleopQuestions();
    this.endgameQuestions = service.getEndgameQuestions();
  }
}
