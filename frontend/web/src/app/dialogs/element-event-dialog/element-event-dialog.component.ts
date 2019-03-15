import {Component, Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
	selector: 'app-element-event-dialog',
	templateUrl: './element-event-dialog.component.html',
	styleUrls: ['./element-event-dialog.component.css']
})
export class ElementEventDialogComponent {

	element: any;

	constructor(public dialogRef: MatDialogRef<ElementEventDialogComponent>, @Inject(MAT_DIALOG_DATA) data) {
		this.element = data;
	}

}
