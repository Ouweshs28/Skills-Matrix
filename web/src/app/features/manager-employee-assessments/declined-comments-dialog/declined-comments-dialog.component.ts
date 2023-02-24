import {Component, Inject, OnInit} from '@angular/core';
import {
  MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA,
  MatLegacyDialogRef as MatDialogRef
} from '@angular/material/legacy-dialog';


export interface DialogData {
  comments: string;
}


@Component({
  selector: 'app-declined-comments-dialog',
  templateUrl: './declined-comments-dialog.component.html',
  styleUrls: ['./declined-comments-dialog.component.scss']
})
export class DeclinedCommentsDialogComponent implements OnInit {

  public comments: string = '';

  constructor(
    public dialogRef: MatDialogRef<DeclinedCommentsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {

  }

  ngOnInit(): void {
  }

  public onNoClick(): void {
    this.dialogRef.close('');
  }

}
