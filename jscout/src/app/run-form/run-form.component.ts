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
  @Input() teleopQuestions: QuestionBase<any>[] = [];
  @Input() endgameQuestions: QuestionBase<any>[] = [];
  form: FormGroup;
  setupForm: FormGroup;
  autoForm: FormGroup;
  teleopForm: FormGroup;
  endgameForm: FormGroup;
  payload = '';

  constructor(private qcs: QuestionControlService) {  }

  ngOnInit() {
    this.form = new FormGroup({});
    this.setupForm = this.qcs.toFormGroup(this.setupQuestions);
    this.autoForm = this.qcs.toFormGroup(this.autoQuestions);
    this.teleopForm = this.qcs.toFormGroup(this.teleopQuestions);
    this.endgameForm = this.qcs.toFormGroup(this.endgameQuestions);
  }

  onSubmit() {
    this.payload = JSON.stringify(this.setupForm.value).concat(JSON.stringify(this.autoForm.value)).concat(JSON.stringify(this.teleopForm.value)).concat(JSON.stringify(this.endgameForm.value));
  }
}
