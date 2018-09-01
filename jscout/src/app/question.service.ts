import { Injectable }       from '@angular/core';

import { QuestionBase }     from './questions/question-base';
import { CheckboxQuestion }  from './questions/question-checkbox';
import { DropdownQuestion } from './questions/question-dropdown';
import { NumberQuestion }  from './questions/question-number';
import { TextareaQuestion } from './questions/question-textarea';
import { TextboxQuestion }  from './questions/question-textbox';

@Injectable()
export class QuestionService {

	getSetupQuestions() {
		let questions: QuestionBase<any>[] = [
/*
			new NumberQuestion({
				key: 'TeamNumber',
				label: 'Team Number',
				required: true,
				order: 1,
				min: 1
			}),

			new NumberQuestion({
				key: 'MatchNumber',
				label: 'Match Number',
				required: true,
				order: 2,
				min: 1
			}),
*/
			new DropdownQuestion({
				key: 'StartPosition',
				label: 'Robot Starting Position',
				options: [
					{key: '', value: 'Select Starting Position', disabled: true},
					{key: 'red_1',  value: 'Red 1'},
					{key: 'red_2',  value: 'Red 2'},
					{key: 'red_3',   value: 'Red 3'},
					{key: 'blue_1',  value: 'Blue 1'},
					{key: 'blue_2',  value: 'Blue 2'},
					{key: 'blue_3',   value: 'Blue 3'}
				],
				required: true,
				order: 3
			})

		];
		return questions.sort((a, b) => a.order - b.order);
	}

	getAutoQuestions() {
		let questions: QuestionBase<any>[] = [

			new CheckboxQuestion({
				key: 'AutoMovementLine',
				label: 'Autonomous Movement Line',
				order: 1
			}),

			new NumberQuestion({
				key: 'AutoSwitchCubes',
				label: 'Autonomous Power Cubes on Switch',
				tickers: true,
				min: 0,
				value: 0,
				order: 2
			}),

			new NumberQuestion({
				key: 'FailedAutoSwitchCubes',
				label: 'Missed Autonomous Power Cubes on Switch',
				tickers: true,
				min: 0,
				value: 0,
				order: 3
			}),

			new NumberQuestion({
				key: 'AutoScaleCubes',
				label: 'Autonomous Power Cubes on Scale',
				tickers: true,
				min: 0,
				value: 0,
				order: 4
			}),

			new NumberQuestion({
				key: 'FailedAutoScaleCubes',
				label: 'Missed Autonomous Power Cubes on Scale',
				tickers: true,
				min: 0,
				value: 0,
				order: 5
			}),

			new NumberQuestion({
				key: 'AutoExchange',
				label: 'Autonomous Power Cubes in Exchange',
				tickers: true,
				min: 0,
				value: 0,
				order: 6
			})

		];
		return questions.sort((a, b) => a.order - b.order);
	}

	getTeleopQuestions() {
		let questions: QuestionBase<any>[] = [

			new NumberQuestion({
				key: 'TeleSwitchCubes',
				label: 'Teleop Power Cubes on Switch',
				tickers: true,
				min: 0,
				value: 0,
				order: 1
			}),

			new NumberQuestion({
				key: 'FailedTeleSwitchCubes',
				label: 'Missed Teleop Power Cubes on Switch',
				tickers: true,
				min: 0,
				value: 0,
				order: 2
			}),

			new NumberQuestion({
				key: 'TeleScaleCubes',
				label: 'Teleop Power Cubes on Scale',
				tickers: true,
				min: 0,
				value: 0,
				order: 3
			}),

			new NumberQuestion({
				key: 'FailedTeleScaleCubes',
				label: 'Missed Teleop Power Cubes on Scale',
				tickers: true,
				min: 0,
				value: 0,
				order: 4
			}),

			new NumberQuestion({
				key: 'TeleExchange',
				label: 'Teleop Power Cubes in Exchange',
				tickers: true,
				min: 0,
				value: 0,
				order: 5
			})

		];
		return questions.sort((a, b) => a.order - b.order);
	}

	getEndgameQuestions() {
		let questions: QuestionBase<any>[] = [

			new DropdownQuestion({
				key: 'EndPosition',
				label: 'Robot End Position',
				options: [
					{key: 'neither',  value: 'Neither'},
					{key: 'park',  value: 'Parked'},
					{key: 'climb',   value: 'Climbed'}
				],
				value: 'neither',
				order: 1
			}),

			new NumberQuestion({
				key: 'YellowCards',
				label: 'Yellow Cards',
				tickers: true,
				min: 0,
				value: 0,
				order: 2
			}),

			new NumberQuestion({
				key: 'RedCards',
				label: 'Red Cards',
				tickers: true,
				min: 0,
				value: 0,
				order: 3
			}),

			new TextareaQuestion({
				key: 'Notes',
				label: 'Additional Notes',
				cols: 40,
				rows: 5,
				order: 4
			})

		];
		return questions.sort((a, b) => a.order - b.order);
	}
}
