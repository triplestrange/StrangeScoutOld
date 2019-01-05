import { QuestionBase } from './question-base';

export class SliderQuestion extends QuestionBase<number> {
	controlType = 'slider';
	min: number;
	max: number;

	constructor(options: {} = {}) {
		super(options);
		this.min = options['min'];
		this.max = options['max'];
	}
}
