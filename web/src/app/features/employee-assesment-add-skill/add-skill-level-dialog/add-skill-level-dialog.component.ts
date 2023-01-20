import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {SkillLevel} from "../../../shared/model/model";


export interface DialogData {
  skillLevel: string;

}

@Component({
  selector: 'app-add-skill-level-dialog',
  templateUrl: './add-skill-level-dialog.component.html',
  styleUrls: ['./add-skill-level-dialog.component.scss']
})
export class AddSkillLevelDialogComponent implements OnInit {
  public skillLevel: string = '';
  // @ts-ignore
  public skillLevelList: SkillLevel[] = SkillLevel.values();

  constructor(
    public dialogRef: MatDialogRef<AddSkillLevelDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {

  }

  ngOnInit(): void {
  }

  public addSkill(selectedSkill: any): void {
    this.data.skillHistory.skillLevel = selectedSkill;
    this.dialogRef.close(this.data);
  }

  public onNoClick(): void {
    this.dialogRef.close('');
  }


}
