import { QuestionBase } from './question-base';

export class TextQuestion extends QuestionBase<string> {
	controlType = 'text';

	constructor(options: {} = {}) {
		super(options);
	}
}
