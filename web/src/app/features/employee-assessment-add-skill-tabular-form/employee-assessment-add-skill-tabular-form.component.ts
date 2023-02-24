import {Component, OnInit} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {SkillHistoryCreateRequest, SkillLevel, SkillResponse,} from 'src/app/shared/model/model';
import {EmployeeApiService} from 'src/app/shared/services/api/employee/employee-api.service';
import {ToastrService} from 'ngx-toastr';
import {SkillApiService} from 'src/app/shared/services/api/skill/skill-api.service';
import {Router} from '@angular/router';
import {v4 as uuidv4} from 'uuid';
import {UtilServiceService} from 'src/app/shared/services/util/util-service.service';


@Component({
  selector: 'app-employee-assessment-add-skill-tabular-form',
  templateUrl: './employee-assessment-add-skill-tabular-form.component.html',
  styleUrls: ['./employee-assessment-add-skill-tabular-form.component.scss']
})
export class EmployeeAssessmentAddSkillTabularFormComponent implements OnInit {

  public addNewAssessmentSkill!: UntypedFormGroup;
  public skillNameList!: SkillResponse[];
  public skillDescription!: string;
  public skillCategory!: string;
  public skillDomain!: string;
  public skillHistory!: SkillHistoryCreateRequest;
  public SkillHistoryAssessments: SkillHistoryCreateRequest[] = [];
  public arrayIndexOfSkillHistoryToBeRemoved: number[] = [];
  private endOfSubscriptionCount: number = 0;
  public selectedSkill!: SkillResponse;
  public passedAllValidationsCheck: boolean = true;
  //@ts-ignore
  public skillLevelList: SkillLevel[] = SkillLevel.values();


  constructor(
    private toastr: ToastrService,
    private employeeApiService: EmployeeApiService,
    private skillApiService: SkillApiService,
    private formBuilder: UntypedFormBuilder,
    private router: Router,
    private utilsService: UtilServiceService,
  ) {
  }

  ngOnInit(): void {
    this.initialiaseForm();
    this.SkillHistoryAssessments.push(new SkillHistoryCreateRequest(uuidv4()));
    this.getAllSkillName();
  }

  public initialiaseForm(): void {
    this.addNewAssessmentSkill = this.formBuilder.group({
      skillNameValidation: ['', Validators.required],
      skillLevelValidation: ['', Validators.required],
      skillDescription: [{value: '', disabled: true}, Validators.required],
      skillCategory: [{value: '', disabled: true}, Validators.required],
      skillDomain: [{value: '', disabled: true}, Validators.required],
    });
  }

  private getAllSkillName(): void {
    let defaultParam = {
      sortOrder: 'ASC',
      sortBy: 'name',
      pageNumber: 0,
      pageSize: 100000,
    };
    this.skillApiService.searchSkills(defaultParam).subscribe(skills => {
      this.skillNameList = skills.content;
    })
  }

  public async createSkillHistory(): Promise<void> {
    this.checkBeforeSubmitting();
    if (this.passedAllValidationsCheck) {
      this.skillHistory = {
        skillHistoryId: uuidv4(),
        skillId: 0,
        //@ts-ignore
        skillLevel: null,
        comments: "",
        skillName: '',
      };
      this.loopAddSkillHistoryService();
    }
    this.passedAllValidationsCheck = !this.passedAllValidationsCheck;
  }

  private loopAddSkillHistoryService(index = 0) {
    //loop through the SkillHistoryAssessments variable and call the API one by one
    if (index < this.SkillHistoryAssessments.length) {
      this.skillHistory.skillLevel = this.SkillHistoryAssessments[index].skillLevel;
      this.skillHistory.skillId = this.SkillHistoryAssessments[index].skillId
      this.skillHistory.comments = this.SkillHistoryAssessments[index].comments;
      let skillObj: SkillResponse[] = this.skillNameList.filter(skillObj => skillObj.id == this.skillHistory.skillId)
      this.skillHistory.skillName = skillObj[0].name;
      this.callAddSkillHistoryService(this.skillHistory, index, () => {
        this.loopAddSkillHistoryService(++index);
      });
    }
  }

  public async callAddSkillHistoryService(skillHistoryRecord: SkillHistoryCreateRequest, index: number, callback: any = null): Promise<void> {
    this.employeeApiService.createSkillHistory(skillHistoryRecord)
      .subscribe(
        result => {
          this.toastr.success('Skill ' + skillHistoryRecord.skillName + ' successfully added for assessment!');
          if (callback != null) callback();
        },
        error => {
          this.toastr.error(error.error.message);
          this.endOfSubscriptionCount++;
          this.checkSkillHistoryCount();
          if (callback != null) callback();
        },
        () => {
          //If good, retain form index in order to be removed from skill array form
          this.arrayIndexOfSkillHistoryToBeRemoved.push(index);
          this.endOfSubscriptionCount++;
          this.checkSkillHistoryCount();
          setTimeout(() => {

          }, 1000);
        }
      );
  }

  //SkillHistoryAssessment -> Form array
  //Sub count -> form array length -> num of subs to be made
  private checkSkillHistoryCount(): void {
    if (this.endOfSubscriptionCount >= this.SkillHistoryAssessments.length) {
      this.endOfSubscriptionCount = 0;
      let skillHistoryTemp: SkillHistoryCreateRequest[] = [];
      for (var i = 0; i < this.SkillHistoryAssessments.length; i++) {
        if (this.arrayIndexOfSkillHistoryToBeRemoved.includes(i)) continue;
        //Put the error form array in temp array
        skillHistoryTemp.push(this.SkillHistoryAssessments[i]);
      }
      //Reassing form array and reset indexToBeRemovedArray
      this.SkillHistoryAssessments = skillHistoryTemp;
      this.arrayIndexOfSkillHistoryToBeRemoved = [];
    }
    if (this.SkillHistoryAssessments.length == 0) {
      this.router.navigate(['employeeAssessment']);
    }
  }

  public addAnother(): void {
    let valid = true;
    this.SkillHistoryAssessments.forEach(skillHistory => {
      if (skillHistory.skillId == undefined || skillHistory.skillLevel == undefined) {
        valid = false;
        this.utilsService.openSnackBar("Please fill in all required fields!", "Ok");
      }
    })

    if (valid) {
      this.SkillHistoryAssessments.push(new SkillHistoryCreateRequest(uuidv4()));
    }
  }

  public deleteSkillHistory(event: any): void {
    this.SkillHistoryAssessments = this.SkillHistoryAssessments.filter(skillHistory => skillHistory.skillHistoryId != event);
  }

  private checkBeforeSubmitting(): void {
    for (var index = 0; index < this.SkillHistoryAssessments.length; index++) {
      if (this.SkillHistoryAssessments[index].skillId == undefined || this.SkillHistoryAssessments[index].skillLevel == undefined) {
        this.passedAllValidationsCheck = false;
        this.utilsService.openSnackBar("Please fill in all required fields!", "Ok");
        break;
      }
    }
  }

  public showDeleteButton(): boolean {
    return this.SkillHistoryAssessments.length >= 2;
  }
}
