import { QuestionBase } from './question-base';

export class CheckboxQuestion extends QuestionBase<boolean> {
	controlType = 'checkbox';

	constructor(options: {} = {}) {
		super(options);
	}
}
