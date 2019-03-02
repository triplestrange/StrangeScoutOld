import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
	selector: 'app-begin-match-dialog',
	templateUrl: './begin-match-dialog.component.html',
	styleUrls: ['./begin-match-dialog.component.css']
})
export class BeginMatchDialogComponent {
	public dialogRef: MatDialogRef<BeginMatchDialogComponent>;
}
