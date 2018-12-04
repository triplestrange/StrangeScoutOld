import { QuestionBase } from './question-base';

export class DropdownQuestion extends QuestionBase<string> {
	controlType = 'dropdown';
	options: {key: string, value: string, disable: boolean}[] = [];

	constructor(options: {} = {}) {
		super(options);
		this.options = options['options'] || [];
	}
}
