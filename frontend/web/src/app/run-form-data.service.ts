import { Injectable } from '@angular/core';

// custom classes
import { OptionEventChoice, GameElement } from './classes';

@Injectable({
	providedIn: 'root'
})
export class RunFormDataService {

	constructor() { }

	// starting positions
	static startingPositions: OptionEventChoice[] = [
		{Name: 'Level 1 Left', Value: '1_left'},
		{Name: 'Level 1 Middle', Value: '1_middle'},
		{Name: 'Level 1 Right', Value: '1_right'},
		{Name: 'Level 2 Left', Value: '2_left'},
		{Name: 'Level 2 Right', Value: '2_right'}
	];

	// starting configs
	static startingConfigs: OptionEventChoice[] = [
		{Name: 'None', Value: 'none'},
		{Name: 'Hatch', Value: 'getHatch'},
		{Name: 'Cargo', Value: 'getCargo'}
	];

	// define possible events
	static gameElements: GameElement[] = [
		{
			Name: 'Get Hatch',
			RevealTime: 0,
			IgnoreHolding: false,
			Event: 'getHatch',
			SubEvents: [
				{Name: 'Top Ship Hatch', Value: 'topHatch'},
				{Name: 'Middle Ship Hatch', Value: 'middleHatch'},
				{Name: 'Bottom Ship Hatch', Value: 'bottomHatch'},
				{Name: 'Cargo Bay Hatch', Value: 'cargoHatch'},
				{Name: 'Dropped Hatch', Value: 'dropHatch'}
			]
		},
		{
			Name: 'Get Cargo',
			RevealTime: 0,
			IgnoreHolding: false,
			Event: 'getCargo',
			SubEvents: [
				{Name: 'Top Ship Cargo', Value: 'topCargo'},
				{Name: 'Middle Ship Cargo', Value: 'middleCargo'},
				{Name: 'Bottom Ship Cargo', Value: 'bottomCargo'},
				{Name: 'Cargo Bay Cargo', Value: 'cargoCargo'},
				{Name: 'Dropped Cargo', Value: 'dropCargo'}
			]
		},
		{
			Name: 'Start Habitat Climb',
			RevealTime: 90,
			IgnoreHolding: true,
			Event: 'startClimb',
			SubEvents: [
				{Name: 'Level 1', Value: 'L1Climb'},
				{Name: 'Level 2', Value: 'L2Climb'},
				{Name: 'Level 3', Value: 'L3Climb'}
			]
		}
	];
}
