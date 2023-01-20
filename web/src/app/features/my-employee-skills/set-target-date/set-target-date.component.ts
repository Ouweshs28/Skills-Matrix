import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {SkillLevel, SkillResponse} from 'src/app/shared/model/model';

export interface DialogData {
  skill: SkillResponse,
  targetedSkillLevel: SkillLevel,
  targetDate: string,
  currentSkillLevel: string
  currentSkillLevelEnum: SkillLevel
  title: string;
}


@Component({
  selector: 'app-set-target-date',
  templateUrl: './set-target-date.component.html',
  styleUrls: ['./set-target-date.component.scss']
})
export class SetTargetDateComponent implements OnInit {

  public skill!: SkillResponse;
  public currentLevel: String;
  SkillLevelEnum: any = SkillLevel;
  public chosenTargetDate!: Date;
  public targetFrom: FormGroup;
  public minDate: Date = new Date();
  public dialogTitle: string;

  //@ts-ignore
  public skillLevelList: SkillLevel[] = SkillLevel.values();

  constructor(public dialogRef: MatDialogRef<SetTargetDateComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    console.log(data)
    this.skill = data.objective.skill;
  }

  ngOnInit(): void {
    this.initialiseForm();
    this.dialogTitle = this.data.title;

  }

  public onDate(event: any) {
    this.data.targetDate = event.value.toLocaleDateString('en-CA');
  }

  public onNoClick(): void {
    this.dialogRef.close('');
  }

  private initialiseForm(): void {

    this.targetFrom = new FormGroup({
      skillLevelField: new FormControl(null, [Validators.required]),
      targetDateField: new FormControl(null, [Validators.required]),

    })

  }
}
