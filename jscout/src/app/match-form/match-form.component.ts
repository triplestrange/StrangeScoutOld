import { Component, Input, OnInit }  from '@angular/core';
import { FormGroup }                 from '@angular/forms';

import { QuestionBase }              from '../questions/question-base';
import { QuestionControlService }    from '../question-control.service';

@Component({
  selector: 'app-match-form',
  templateUrl: './match-form.component.html',
  providers: [ QuestionControlService ]
})
export class MatchFormComponent implements OnInit {

  @Input() questions: QuestionBase<any>[] = [];
  form: FormGroup;
  payload = '';

  constructor(private qcs: QuestionControlService) {  }

  ngOnInit() {
    this.form = this.qcs.toFormGroup(this.questions);
  }

  onSubmit() {
    this.payload = JSON.stringify(this.form.value);
  }
}
