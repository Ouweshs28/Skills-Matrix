import {Injectable} from '@angular/core';
import {MatLegacyDialog as MatDialog} from "@angular/material/legacy-dialog";
import {Observable} from "rxjs";
import {
  AddSkillLevelDialogComponent
} from "../../../features/employee-assesment-add-skill/add-skill-level-dialog/add-skill-level-dialog.component";
import {SkillLevel} from "../../model/model";

@Injectable({
  providedIn: 'root'
})
export class AddSkillLevelModalService {


  public skillLevel: string;
  public currentSkillLevelEnum: SkillLevel;
  //@ts-ignore
  public skillLevelList: SkillLevel[] = SkillLevel.values();


  constructor(public dialog: MatDialog) {
  }

  public openDialog(skill: any): Observable<any> {


    const dialogRef = this.dialog.open(AddSkillLevelDialogComponent, {
      disableClose: true,
      data: {
        skillHistory: skill
      }
    });

    return dialogRef.afterClosed();


  }
}
