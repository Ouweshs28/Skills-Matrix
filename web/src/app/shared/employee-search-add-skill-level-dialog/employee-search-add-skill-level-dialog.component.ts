import {AfterViewInit, ChangeDetectorRef, Component, Inject, OnInit, Optional} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {SkillLevel, SkillResponse} from "../model/model";
import {SkillApiService} from "../services/api/skill/skill-api.service";
import {UntypedFormControl, UntypedFormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-employee-search-add-skill-level-dialog',
  templateUrl: './employee-search-add-skill-level-dialog.component.html',
  styleUrls: ['./employee-search-add-skill-level-dialog.component.scss']
})
export class EmployeeSearchAddSkillLevelDialogComponent implements OnInit, AfterViewInit {
  public skillLevelAdditionForm: UntypedFormGroup;
  action: string;
  local_data: any;
  skill = {
    id: null,
    name: null
  };
  skillsList: SkillResponse[] = [];
  searchSkillCrtieria: string = "";
  // @ts-ignore
  skillLevelList: SkillLevel[] = SkillLevel.values();
  level: string = "";
  existingData = [];
  existingSkill: number[];

  pleaseChooseSkill = {
    id: null,
    name: 'Search a skill'
  }

  constructor(public dialogRef: MatDialogRef<EmployeeSearchAddSkillLevelDialogComponent>,
              //@Optional() is used to prevent error if no data is passed
              @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
              private skillServiceApi: SkillApiService,
              private cdref: ChangeDetectorRef) {
    var fixData = new Array(data)
    this.local_data = fixData[0];
    console.log(this.local_data);
    this.action = this.local_data.action;
    this.level = this.local_data.level;
    this.skill.id = this.local_data.id;
    this.skill.name = this.local_data.name;
    var fixData2 = new Array(this.local_data.existingData)
    // @ts-ignore
    this.existingData = fixData2[0];
    this.initForm(this.action);
  }

  ngAfterViewInit(): void {
    // @ts-ignore
    this.existingSkill = this.existingData.map(skill => skill.id);
    console.log(this.existingSkill);

  }

  doAction() {
    this.local_data.id = this.skill.id;
    this.local_data.name = this.skill.name;
    this.local_data.level = this.level;
    this.dialogRef.close({event: this.action, data: this.local_data});
  }

  closeDialog() {
    this.action = 'Cancel';
    this.dialogRef.close({event: 'Cancel'});
  }

  public getEmployeeSkills(criteria: string, existingSkillIds?: number[]): void {
    let params = {
      sortOrder: 'ASC',
      sortBy: 'name',
      pageNumber: 0,
      pageSize: 10,
      keyword: null,
      existingSkill: existingSkillIds
    }
    if (existingSkillIds == []) {
      this.skillServiceApi.searchSkills(params).subscribe(result => {
          this.skillsList = [];
          this.skillsList = result.content;
        },
        error => {
        },
        () => {
        }
      );
    } else {
      // @ts-ignore
      params.keyword = criteria;
      this.skillServiceApi.searchSkills(params).subscribe(result => {
          this.skillsList = result.content;
        },
        error => {
        },
        () => {
        }
      );
    }

  }


  public skillOnKey(event: any): void {
    if (event.target.value == "") {
      this.skillsList = [];
      // @ts-ignore
      this.skillsList.push(this.pleaseChooseSkill);
    } else {
      this.searchSkillCrtieria = event.target.value;
      this.getEmployeeSkills(this.searchSkillCrtieria, this.existingSkill)
    }

  }

  ngOnInit(): void {
    // @ts-ignore
    this.skillsList.push(this.pleaseChooseSkill)

  }

  private initForm(action: string): void {
    if (action !== "Delete") {
      this.skillLevelAdditionForm = new UntypedFormGroup({
        skill: new UntypedFormControl(null, Validators.required),
        level: new UntypedFormControl(null, Validators.required),
      });
    } else {
      this.skillLevelAdditionForm = new UntypedFormGroup({
        skill: new UntypedFormControl(null),
        level: new UntypedFormControl(null,),
      });
    }
  }

  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }

  compareObjects(o1: any, o2: any): boolean {
    return o1.id === o2.id;
  }

  onClose() {
    this.searchSkillCrtieria = "";
    this.skillsList = [];
    // @ts-ignore
    this.skillsList.push(this.pleaseChooseSkill);
  }
}
