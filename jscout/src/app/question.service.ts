import { Injectable } from '@angular/core';

import { QuestionBase } from './question-types/question-base';
import { CheckboxQuestion } from './question-types/question-checkbox';
import { DropdownQuestion } from './question-types/question-dropdown';
import { NumberQuestion } from './question-types/question-number';
import { TextareaQuestion } from './question-types/question-textarea';
import { TextQuestion } from './question-types/question-text';
import { SliderQuestion } from './question-types/question-slider'

@Injectable()
export class QuestionService {

	// DO NOT EDIT THESE QUESTIONS
	getSetupQuestions() {
		const questions: QuestionBase<any>[] = [
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
			new DropdownQuestion({
				key: 'StartPosition',
				label: 'Robot Starting Position',
				options: [
					{value: '', name: 'Select Starting Position', disabled: true},
					{value: 'red_1',  name: 'Red 1'},
					{value: 'red_2',  name: 'Red 2'},
					{value: 'red_3',   name: 'Red 3'},
					{value: 'blue_1',  name: 'Blue 1'},
					{value: 'blue_2',  name: 'Blue 2'},
					{value: 'blue_3',   name: 'Blue 3'}
				],
				required: true,
				order: 3
			})
		];
		return questions.sort((a, b) => a.order - b.order);
	}
	// ================================================================================

	// Autonomous period questions
	getAutoQuestions() {
		const questions: QuestionBase<any>[] = [

			new NumberQuestion({
				key: 'SandBottomShipPanel',
				label: 'Sandstorm Bottom Ship Panel',
				min: 0,
				max: 4,
				value: 0,
				tickers: true,
				order: 0
			}),
			new NumberQuestion({
				key: 'SandMiddleShipPanel',
				label: 'Sandstorm Middle Ship Panel',
				min: 0,
				max: 4,
				value: 0,
				tickers: true,
				order: 1
			}),
			new NumberQuestion({
				key: 'SandTopShipPanel',
				label: 'Sandstorm Top Ship Panel',
				min: 0,
				max: 4,
				value: 0,
				tickers: true,
				order: 2
			}),
			new NumberQuestion({
				key: 'SandCargoBayPanel',
				label: 'Sandstorm Cargo Bay Panel',
				min: 0,
				max: 8,
				value: 0,
				tickers: true,
				order: 3
			}),

			new NumberQuestion({
				key: 'SandBottomShipCargo',
				label: 'Sandstorm Bottom Ship Cargo',
				min: 0,
				max: 4,
				value: 0,
				tickers: true,
				order: 4
			}),
			new NumberQuestion({
				key: 'SandMiddleShipCargo',
				label: 'Sandstorm Middle Ship Cargo',
				min: 0,
				max: 4,
				value: 0,
				tickers: true,
				order: 5
			}),
			new NumberQuestion({
				key: 'SandTopShipCargo',
				label: 'Sandstorm Top Ship Cargo',
				min: 0,
				max: 4,
				value: 0,
				tickers: true,
				order: 6
			}),
			new NumberQuestion({
				key: 'SandCargoBayCargo',
				label: 'Sandstorm Cargo Bay Cargo',
				min: 0,
				max: 8,
				value: 0,
				tickers: true,
				order: 7
			})

		];
		return questions.sort((a, b) => a.order - b.order);
	}

	// Teleop period questions
	getTeleopQuestions() {
		const questions: QuestionBase<any>[] = [

			new NumberQuestion({
				key: 'SandBottomShipPanel',
				label: 'Sandstorm Bottom Ship Panel',
				min: 0,
				max: 4,
				value: 0,
				tickers: true,
				order: 0
			}),
			new NumberQuestion({
				key: 'SandMiddleShipPanel',
				label: 'Sandstorm Middle Ship Panel',
				min: 0,
				max: 4,
				value: 0,
				tickers: true,
				order: 1
			}),
			new NumberQuestion({
				key: 'SandTopShipPanel',
				label: 'Sandstorm Top Ship Panel',
				min: 0,
				max: 4,
				value: 0,
				tickers: true,
				order: 2
			}),
			new NumberQuestion({
				key: 'SandCargoBayPanel',
				label: 'Sandstorm Cargo Bay Panel',
				min: 0,
				max: 8,
				value: 0,
				tickers: true,
				order: 3
			}),

			new NumberQuestion({
				key: 'SandBottomShipCargo',
				label: 'Sandstorm Bottom Ship Cargo',
				min: 0,
				max: 4,
				value: 0,
				tickers: true,
				order: 4
			}),
			new NumberQuestion({
				key: 'SandMiddleShipCargo',
				label: 'Sandstorm Middle Ship Cargo',
				min: 0,
				max: 4,
				value: 0,
				tickers: true,
				order: 5
			}),
			new NumberQuestion({
				key: 'SandTopShipCargo',
				label: 'Sandstorm Top Ship Cargo',
				min: 0,
				max: 4,
				value: 0,
				tickers: true,
				order: 6
			}),
			new NumberQuestion({
				key: 'SandCargoBayCargo',
				label: 'Sandstorm Cargo Bay Cargo',
				min: 0,
				max: 8,
				value: 0,
				tickers: true,
				order: 7
			})

		];
		return questions.sort((a, b) => a.order - b.order);
	}

	// Endgame questions
	getEndgameQuestions() {
		const questions: QuestionBase<any>[] = [

			new DropdownQuestion({
				key: 'HabitatPosition',
				label: 'Robot Habitat Position',
				options: [
					{value: '0', name: 'None'},
					{value: '1', name: 'Level 1'},
					{value: '2', name: 'Level 2'},
					{value: '3', name: 'Level 3'}
				],
				value: '0',
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
				rows: 5,
				order: 4
			})

		];
		return questions.sort((a, b) => a.order - b.order);
	}
}
