import { Component, OnInit } from '@angular/core';
import { ScouterService } from '../scouter.service';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.css'],
	providers: [ ScouterService ]
})
export class HomeComponent implements OnInit {

	constructor(private ss: ScouterService) { }

	scouter = this.ss.getScouter();
	
	editScouter() {
		this.ss.editScouter();
		this.scouter = this.ss.getScouter();
	}

	ngOnInit() {
	}

}
