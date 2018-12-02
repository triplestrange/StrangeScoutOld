import { Component, Input } from '@angular/core';
import { FormGroup }        from '@angular/forms';

import { QuestionBase }     from '../question-types/question-base';

@Component({
	selector: 'app-form-block',
	templateUrl: './form-block.component.html',
	styleUrls: ['./form-block.component.css']
})
export class FormBlockComponent {

	// inputs for creating a form block
	@Input() question: QuestionBase<any>;
	@Input() form: FormGroup;

	// is form block valid?
	get isValid() { return this.form.controls[this.question.key].valid; }

	// define change event
	changeEvent = new Event('change');

	// function for plus button
	plusbutton(id: string) {
		// increase a specific element by 1 and trigger a change event for it
		(<HTMLInputElement>document.getElementById(id)).stepUp();
		(<HTMLInputElement>document.getElementById(id)).dispatchEvent(this.changeEvent);
	}

	// function for minus button
	minusbutton(id: string) {
		// decrease a specific element by 1 and trigger a change event for it
		(<HTMLInputElement>document.getElementById(id)).stepDown();
		(<HTMLInputElement>document.getElementById(id)).dispatchEvent(this.changeEvent);
	}

}
