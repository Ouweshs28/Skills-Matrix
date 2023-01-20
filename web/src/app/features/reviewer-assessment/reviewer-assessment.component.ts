import {Component, OnInit, ViewChild} from '@angular/core';
import {PageEvent} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {EmployeeResponse, SkillHistoryResponse, SkillLevel} from 'src/app/shared/model/model';
import {EmployeeApiService} from 'src/app/shared/services/api/employee/employee-api.service';
import {MatTableDataSource} from "@angular/material/table";
import {Router} from "@angular/router";
import {StateService} from "../../shared/services/state/state.service";
import {ManagerApiService} from "../../shared/services/api/manager/manager-api.service";

@Component({
  selector: 'app-reviewer-assessment',
  templateUrl: './reviewer-assessment.component.html',
  styleUrls: ['./reviewer-assessment.component.scss']
})
export class ReviewerAssessmentComponent implements OnInit {

  public checkIfHaveEmployeesToBeReviewed: boolean;
  public employeesToBeReviewed: EmployeeResponse[] = [];
  public searchEmployeeByName!: string;
  public selectedEmployee!: EmployeeResponse;
  public hasSelectedAnEmployeeToReview!: boolean;
  public dataSource!: any;
  public displayedColumns: string[] = ['skillName', 'skillLevel', 'comments', 'actions'];
  public SkillLevelEnum: any = SkillLevel;
  public totalElements!: number;
  public pageSize: number = 10;
  public pageEvent!: PageEvent;
  public pageIndex: number = 0;
  public skillHistoryArray: SkillHistoryResponse[] = [];

  @ViewChild(MatSort) sort!: MatSort;

  private defaultParam = {
    sortOrder: 'DESC',
    sortBy: 'updatedOn',
    pageNumber: 0,
    pageSize: 10
  }

  constructor(private employeeApiService: EmployeeApiService,
              private managerServiceApi: ManagerApiService,
              private router: Router,
              private stateService: StateService) {
    if (this.stateService.hasSelectedReview) {
      this.hasSelectedAnEmployeeToReview = stateService.hasSelectedReview;
      this.selectedEmployee = this.stateService.selectedEmployee;
      this.getEmployeeToBeReviewedSkillHistories()
    }
  }

  ngOnInit(): void {
    this.checkForEmployeesToBeReviewed();

  }


  private checkForEmployeesToBeReviewed(): void {
    let param = {
      keyword: ''
    }
    this.employeeApiService.findEmployeeToReview(param).subscribe((result => {
        this.employeesToBeReviewed = result.content;
        console.log("Result: ", result);
        if (this.employeesToBeReviewed.length > 0) this.checkIfHaveEmployeesToBeReviewed = true;
      })
    );
  }


  public getEmployeeSelected(event: any): void {
    this.selectedEmployee = event.value;
    this.hasSelectedAnEmployeeToReview = true;
    this.getEmployeeToBeReviewedSkillHistories();
  }

  public employeeNameOnKeyUp(event: any): void {
    let param = {
      keyword: event.target.value
    }
    this.employeeApiService.findEmployeeToReview(param).subscribe((result => {
        this.employeesToBeReviewed = result.content;
      })
    );
  }

  private getEmployeeToBeReviewedSkillHistories(): void {
    this.managerServiceApi.findSkillHistoryByEmployeeId(this.selectedEmployee.id, this.defaultParam).subscribe(
      (skillHistories) => {
        this.skillHistoryArray = skillHistories.content;
        this.dataSource = new MatTableDataSource(this.skillHistoryArray);
        this.totalElements = skillHistories.totalElements;
        this.dataSource.sort = this.sort;
      });
  }

  public sortData(event: any) {
    this.defaultParam.sortOrder = event.direction;
    this.defaultParam.sortBy = event.active;
    this.defaultParam.pageNumber = this.pageIndex;
    this.defaultParam.pageSize = this.pageSize;
    this.getEmployeeToBeReviewedSkillHistories();
  }

  public onPaginateChange(event: any) {
    let page = event.pageIndex;
    let size = event.pageSize;
    this.pageSize = size;
    this.pageIndex = page;
    this.defaultParam.pageNumber = page;
    this.defaultParam.pageSize = size;
    this.getEmployeeToBeReviewedSkillHistories();
  }

  public onClose() {
    this.searchEmployeeByName = "";
    this.checkForEmployeesToBeReviewed();
  }

  public navigateToUpdate(skillHistoryResponse: SkillHistoryResponse) {
    this.stateService.skillHistoryResponse = skillHistoryResponse;
    this.stateService.hasSelectedReview = this.hasSelectedAnEmployeeToReview;
    this.stateService.selectedEmployee = this.selectedEmployee;
    this.router.navigate(["/updateSkillAssessment/" + skillHistoryResponse.id + "/"])
  }

}
