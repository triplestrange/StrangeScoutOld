import { Injectable }       from '@angular/core';

import { DropdownQuestion } from './questions/question-dropdown';
import { QuestionBase }     from './questions/question-base';
import { TextboxQuestion }  from './questions/question-textbox';
import { NumberQuestion }  from './questions/question-number';
import { CheckboxQuestion }  from './questions/question-checkbox';

@Injectable()
export class QuestionService {

  // TODO: get from a remote source of question metadata
  // TODO: make asynchronous
  getSetupQuestions() {
    let questions: QuestionBase<any>[] = [

      new NumberQuestion({
        key: 'TeamNumber',
        label: 'Team Number',
        required: true,
        order: 1,
        min: 0
      }),

      new NumberQuestion({
        key: 'MatchNumber',
        label: 'Match Number',
        required: true,
        order: 2,
        min: 0
      }),

      new DropdownQuestion({
        key: 'StartPosition',
        label: 'Robot Starting Position',
        options: [
          {key: 'red_1',  value: 'Red 1'},
          {key: 'red_2',  value: 'Red 2'},
          {key: 'red_3',   value: 'Red 3'},
          {key: 'blue_1',  value: 'Blue 1'},
          {key: 'blue_2',  value: 'Blue 2'},
          {key: 'blue_3',   value: 'Blue 3'}
        ],
        required: true,
        order: 3
      })

    ];
    return questions.sort((a, b) => a.order - b.order);
  }

  getAutoQuestions() {
    let questions: QuestionBase<any>[] = [

      new CheckboxQuestion({
        key: 'AutoMovementLine',
        label: 'Autonomous Movement Line',
        order: 4
      })

    ];
    return questions.sort((a, b) => a.order - b.order);
  }
}
