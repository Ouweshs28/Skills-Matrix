import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {MatLegacyDialog as MatDialog} from '@angular/material/legacy-dialog';
import {
  DeclinedCommentsDialogComponent
} from 'src/app/features/manager-employee-assessments/declined-comments-dialog/declined-comments-dialog.component';


@Injectable({
  providedIn: 'root'
})
export class CommentModalService {

  public comments: string = '';

  constructor(public dialog: MatDialog) {
  }

  public openDialog(): Observable<any> {

    const dialogRef = this.dialog.open(DeclinedCommentsDialogComponent, {
      height: '300px',
      width: '450px',
      data: {comments: this.comments}
    });

    return dialogRef.afterClosed();

  }
}
