import {animate, style, group, animateChild, query, stagger, transition} from '@angular/animations';

export const rightIn = [
	query(':enter, :leave', style({ position: 'fixed', width:'100%' }), { optional: true }),
	group([
		// block executes in parallel
		query(':enter', [
			style({ transform: 'translateX(100%)' }),
			animate('0.5s ease-in-out', style({ transform: 'translateX(0%)' }))
		], { optional: true }),
		query(':leave', [
			style({ transform: 'translateX(0%)' }),
			animate('0.5s ease-in-out', style({ transform: 'translateX(-100%)' }))
		], { optional: true }),
	])
	]

export const leftIn = [
	query(':enter, :leave', style({ position: 'fixed', width:'100%' }), { optional: true }),
	group([
		// block executes in parallel
		query(':enter', [
			style({ transform: 'translateX(-100%)' }),
			animate('0.5s ease-in-out', style({ transform: 'translateX(0%)' }))
		], { optional: true }),
		query(':leave', [
			style({ transform: 'translateX(0%)' }),
			animate('0.5s ease-in-out', style({ transform: 'translateX(100%)' }))
		], { optional: true }),
	])
	]