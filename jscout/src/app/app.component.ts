import { Component }       from '@angular/core';

import { QuestionService } from './question.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers:  [QuestionService]
})
export class AppComponent {
  questions: any[];

  title = 'StrangeScout';
  year = '2018';
  game = 'Power Up';

  constructor(service: QuestionService) {
    this.questions = service.getQuestions();
  }
}
