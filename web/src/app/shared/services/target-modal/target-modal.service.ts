import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {SetTargetDateComponent} from 'src/app/features/my-employee-skills/set-target-date/set-target-date.component';
import {SkillLevel, SkillResponse} from '../../model/model';


@Injectable({
  providedIn: 'root'
})
export class TargetModalService {

  public skillName: SkillResponse;
  //@ts-ignore
  public targetedSkillLevel: SkillLevel = null;
  public currentSkillLevel: string;
  public targetDate: string = '';
  public currentSkillLevelEnum: SkillLevel;
  //@ts-ignore
  public skillLevelList: SkillLevel[] = SkillLevel.values();


  constructor(public dialog: MatDialog) {
  }

  public openDialog(skillObjective: any, title: string): Observable<any> {


    const dialogRef = this.dialog.open(SetTargetDateComponent, {
      height: '45vH',
      width: '30vW',
      disableClose: true,
      data: {
        title: title,
        objective: skillObjective
      }
    });

    return dialogRef.afterClosed();


  }


}
