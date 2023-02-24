import {Component, OnInit} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {
  SkillHistoryCreateRequest,
  SkillHistoryResponse,
  SkillHistoryUpdateRequest,
  SkillLevel,
  SkillStatus
} from 'src/app/shared/model/model';
import {EmployeeApiService} from 'src/app/shared/services/api/employee/employee-api.service';
import {ToastrService} from 'ngx-toastr';
import {ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';
import {StateService} from "../../shared/services/state/state.service";

@Component({
  selector: 'app-employee-assessment-update-skill',
  templateUrl: './update-skill-assessment-record.component.html',
  styleUrls: ['./update-skill-assessment-record.component.scss'],
})

export class UpdateSkillAssessmentRecordComponent implements OnInit {
  public updateAssessmentSkill!: UntypedFormGroup;
  public skillLevelValue!: any;
  public skillDescription!: string;
  public skillCategory!: string;
  public skillDomain!: string;
  public skillName!: string;
  public skillComments: string;
  public skillHistoryUpdateRecord!: SkillHistoryUpdateRequest;
  public employeeId!: number;
  public statusType!: SkillStatus;
  public skillHistoryRecord!: SkillHistoryResponse;
  //@ts-ignore
  public skillLevelList: SkillLevel[] = SkillLevel.values();
  public skillHistoryId: number;

  constructor(
    private toastr: ToastrService,
    private employeeApiService: EmployeeApiService,
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute,
    private location: Location,
    private stateService: StateService
  ) {
  }

  ngOnInit(): void {
    this.initialiaseForm();
    this.retrieveSkillHistoryRecord();
    this.getSkillAssessmentProperties();
  }

  private initialiaseForm(): void {
    this.updateAssessmentSkill = this.formBuilder.group({
      skillName: [{value: '', disabled: true}, Validators.required],
      skillLevel: ['', Validators.required],
      skillDescription: [{value: '', disabled: true}, Validators.required],
      skillCategory: [{value: '', disabled: true}, Validators.required],
      skillDomain: [{value: '', disabled: true}, Validators.required],
      skillComments: [null],
    });
  }

  private getSkillAssessmentProperties(): void {
    this.skillHistoryId = this.skillHistoryRecord.id;
    this.skillName = this.skillHistoryRecord.skillName;
    this.skillDescription = this.skillHistoryRecord.skillDescription;
    this.skillDomain = this.skillHistoryRecord.employeeDomainName;
    this.skillCategory = this.skillHistoryRecord.skillCategoryName;
    this.skillComments = this.skillHistoryRecord.comments;
    this.statusType = this.skillHistoryRecord.status;

    /*this.employeeApiService.findSkillHistoryById(
      this.skillHistoryId
    ).subscribe((skillHistoryIdResponse) => {
      this.skillNameIdValue = skillHistoryIdResponse.skillId
      this.skillName = skillHistoryIdResponse.skillName;
      this.skillDescription = skillHistoryIdResponse.skillDescription;
      this.skillCategory = skillHistoryIdResponse.skillCategoryName
      this.skillComments = skillHistoryIdResponse.comments;
    });*/
  }

  public submitSkillHistoryRecord(): void {
    if (this.statusType == "PENDING") {
      this.updateSkillHistory();
    } else {
      this.createSkillHistory();
    }

  }

  private updateSkillHistory(): void {
    this.skillHistoryUpdateRecord = {
      skillLevel: this.skillLevelValue,
      comments: this.skillComments,
    };

    this.employeeApiService.updateSkillHistory(this.skillHistoryId, this.skillHistoryUpdateRecord).subscribe(
      (skillHistoryUpdateRecord) => {
        this.toastr.success('Assessment for skill ' + this.skillName + ' has been successfully updated!');
        setTimeout(() => {
          this.back();
        }, 2000);
      },
      (error) => {
        this.toastr.error(error.error.message)
      }
    );

    // this.EmployeeApiService.updateSkillHistory(
    //   this.employeeId,
    //   this.skillHistoryUpdateRecord,
    //   this.skillHistoryId
    // ).subscribe(
    //   (skillHistory) => {
    //     this.toastr.success(
    //       'Assessment for skill ' +
    //       this.skillName +
    //       ' has been successfully updated!'
    //     );
    //     setTimeout(() => {
    //       this.back();
    //     }, 2000);
    //   },
    //   (err) => this.toastr.error(err.error.message)
    // );
  }

  private createSkillHistory(): void {
    let skillHistoryCreateRequest: SkillHistoryCreateRequest = {
      skillId: this.skillHistoryRecord.skillId,
      skillLevel: this.skillLevelValue,
      comments: this.skillComments
    }

    this.employeeApiService.createSkillHistory(skillHistoryCreateRequest).subscribe(
      (skillHistoryCreateRecord) => {
        this.toastr.success('Assessment for skill ' + this.skillName + ' has been successfully updated!');
        setTimeout(() => {
          this.back();
        }, 2000);
      },
      (error) => {
        this.toastr.error(error.error.message)
      }
    );
  }

  private retrieveSkillHistoryRecord(): void {
    this.skillHistoryRecord = this.stateService.skillHistoryResponse;
    console.log(this.skillHistoryRecord);

  }

  public back(): void {
    // if (this.assessmentType == "employeeAssessmentUpdate") {
    //   this.router.navigate(['/employeeAssessment']);
    // } else {
    //   this.router.navigate(['/reviewerAssessment']);
    // }
    //this.navigation.back();
    this.location.back();
  }
}
