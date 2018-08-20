import { Component, Input } from '@angular/core';
import { FormGroup }        from '@angular/forms';

import { QuestionBase }     from '../questions/question-base';

@Component({
  selector: 'app-question',
  templateUrl: './form-question.component.html'
})
export class FormQuestionComponent {
  @Input() question: QuestionBase<any>;
  @Input() form: FormGroup;
  get isValid() { return this.form.controls[this.question.key].valid; }

  // define change event
  changeEvent = new Event('change');

  plusbutton(id: string) {
    // increase a specific element by 1 and trigger a change event for it
    (<HTMLInputElement>document.getElementById(id)).stepUp();
    (<HTMLInputElement>document.getElementById(id)).dispatchEvent(this.changeEvent);
  }

  minusbutton(id: string) {
    // decrease a specific element by 1 and trigger a change event for it
    (<HTMLInputElement>document.getElementById(id)).stepDown();
    (<HTMLInputElement>document.getElementById(id)).dispatchEvent(this.changeEvent);
  }
}
