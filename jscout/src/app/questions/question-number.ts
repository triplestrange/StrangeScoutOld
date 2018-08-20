import { QuestionBase } from './question-base';

export class NumberQuestion extends QuestionBase<number> {
  controlType = 'number';
  min: number;
  max: number;
  tickers: boolean;

  constructor(options: {} = {}) {
    super(options);
    this.min = options['min'];
    this.max = options['max'];
    this.tickers = options['tickers'];
  }
}
