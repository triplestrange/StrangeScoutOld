import { Component, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
	selector: 'app-end-match-dialog',
	templateUrl: './end-match-dialog.component.html',
	styleUrls: ['./end-match-dialog.component.css']
})
export class EndMatchDialogComponent {
	constructor(public dialogRef: MatDialogRef<EndMatchDialogComponent>, @Inject(MAT_DIALOG_DATA) data) {}
	notes: string;
	submit() {
		this.dialogRef.close(this.notes);
	}
}
