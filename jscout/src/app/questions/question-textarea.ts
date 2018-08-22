import { QuestionBase } from './question-base';

export class TextareaQuestion extends QuestionBase<string> {
  controlType = 'textarea';
  type: string;
  cols: number;
  rows: number;

  constructor(options: {} = {}) {
    super(options);
    this.type = options['type'] || '';
    this.cols = options['cols'];
    this.rows = options['rows'];
  }
}
