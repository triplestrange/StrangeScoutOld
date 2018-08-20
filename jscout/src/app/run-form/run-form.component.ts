import { Component, Input, OnInit }  from '@angular/core';
import { FormGroup }                 from '@angular/forms';

import { QuestionBase }              from '../questions/question-base';
import { QuestionControlService }    from '../question-control.service';

@Component({
  selector: 'app-run-form',
  templateUrl: './run-form.component.html',
  providers: [ QuestionControlService ]
})
export class RunFormComponent implements OnInit {

  @Input() setupQuestions: QuestionBase<any>[] = [];
  @Input() autoQuestions: QuestionBase<any>[] = [];
  form: FormGroup;
  setupForm: FormGroup;
  autoForm: FormGroup;
  payload = '';

  constructor(private qcs: QuestionControlService) {  }

  ngOnInit() {
    this.form = new FormGroup({});
    this.setupForm = this.qcs.toFormGroup(this.setupQuestions);
    this.autoForm = this.qcs.toFormGroup(this.autoQuestions);
  }

  onSubmit() {
    this.payload = JSON.stringify(this.setupForm.value).concat(JSON.stringify(this.autoForm.value));
  }
}
