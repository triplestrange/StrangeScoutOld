import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { QuestionBase } from './question-types/question-base';

@Injectable()
export class QuestionControlService {
	constructor() { }

	toFormGroup(questions: QuestionBase<any>[] ) {
		const group: any = {};

		questions.forEach(question => {
			if (question.required) {
				group[question.key] = new FormControl(question.value || '', Validators.required);
			} else {
				group[question.key] = new FormControl(question.value || '');
			}
		});

		return new FormGroup(group);
	}
}
