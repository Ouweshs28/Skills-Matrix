import {AfterContentInit, Component, ViewChild} from '@angular/core';
import {
  EmployeeResponse,
  ManagerResponse,
  SkillHistoryResponse,
  SkillHistoryReviewUpdateRequest,
  SkillLevel,
  SkillObjectiveCreateRequest,
  SkillObjectiveUpdateRequest,
  SkillStatus
} from 'src/app/shared/model/model';
import {EmployeeApiService} from 'src/app/shared/services/api/employee/employee-api.service';
import {MatSort} from '@angular/material/sort';
import {MatLegacyTableDataSource as MatTableDataSource} from '@angular/material/legacy-table';
import {LegacyPageEvent as PageEvent} from '@angular/material/legacy-paginator';
import {ToastrService} from 'ngx-toastr';
import {CommentModalService} from 'src/app/shared/services/comment-modal/comment-modal.service';
import {UtilServiceService} from 'src/app/shared/services/util/util-service.service';
import {ManagerApiService} from "../../shared/services/api/manager/manager-api.service";
import {StateService} from "../../shared/services/state/state.service";

@Component({
  selector: 'app-manager-employee-assessments',
  templateUrl: './manager-employee-assessments.component.html',
  styleUrls: ['./manager-employee-assessments.component.scss']
})
export class ManagerEmployeeAssessmentsComponent implements AfterContentInit {
//TODO FIX REVIEWER LIST
  public searchEmployeeByName!: string;
  public searchReviewerByName!: string;
  public showDelegateButton: boolean = true;
  public showDelegateOptions: boolean = false;
  public managerEmployeesList: ManagerResponse[] = []
  public futureReviewersList: EmployeeResponse[] = [];
  public sendReviewersMail: boolean = true;
  public chosenReviewersForDelegation: number[] = [];
  public selectedEmployee: ManagerResponse;
  public selectedEmployeeIdExistingReviewerList: EmployeeResponse[] = [];
  public selectedTabReviewerName: string;
  public tabs: string[] = [];
  public dataSource!: any;
  public SkillLevelEnum: any = SkillLevel;
  public displayedColumns: string[] = ['skillName', 'skillLevel', 'NoActionscomments'];
  public displayedColumnsForEmployeeToBeApproved: string[] = ['skillName', 'skillLevel', 'comments', 'actions'];
  public columns: string[] = [];
  public skillHistoryArray: SkillHistoryResponse[];
  public totalElements!: number;
  public pageSize: number = 10;
  public displayTableColumnActions: boolean = false;
  public selectedExisitingReviewer !: ManagerResponse[];
  public pageEvent!: PageEvent;
  public pageIndex: number = 0;
  public displayTableWithActions: boolean;
  public displayTableWithNoActions: boolean;
  public checkIfEmployeeIsValid: boolean;
  public skillObjectiveCreateObject: SkillObjectiveCreateRequest;
  public skillObjectiveUpdateObject: SkillObjectiveUpdateRequest;
  public listOfEmployeesToRestrictAsReviewers: number[] = [];
  @ViewChild(MatSort) sort!: MatSort;

  private defaultParam = {
    sortOrder: 'DESC',
    sortBy: 'skillName',
    pageNumber: 0,
    pageSize: 10000,
    employeeName: '',

  };

  constructor(private employeeApiService: EmployeeApiService,
              private toastr: ToastrService,
              private commentModalService: CommentModalService,
              private utilService: UtilServiceService,
              private managerApiService: ManagerApiService,
              private stateService: StateService) {
  }

  ngAfterContentInit(): void {
    this.getCurrentUserSession();
    this.getManagerEmployeeList();

  }


  private getCurrentUserSession(): void {
    this.listOfEmployeesToRestrictAsReviewers.push(this.stateService.loggedInUser.id);
  }


  public employeeNameOnKeyUp(event: any) {
    this.searchEmployeeByName = event.target.value;
    this.defaultParam.employeeName = this.searchEmployeeByName;
    this.managerApiService.searchManagersEmployees(this.stateService.loggedInUser.id, this.defaultParam).subscribe((employees) => {
      this.managerEmployeesList = employees.content;
    });
  }

  public reviewerNameOnKeyUp(event: any) {
    this.searchEmployeeByName = event.target.value;

    let param = {
      sortOrder: 'ASC',
      sortBy: 'firstName',
      pageNumber: 0,
      pageSize: 10000,
      managerId: this.stateService.loggedInUser.id,
      employeeId: this.listOfEmployeesToRestrictAsReviewers,
      employeeName: this.searchEmployeeByName
    }

    this.managerApiService.searchEmployees(param).subscribe((reviewers) => {
      this.futureReviewersList = reviewers.content;
    });
  }


  public getEmployeeSelected(event: any) {
    this.selectedEmployee = event.value;
    this.checkIfEmployeeIsValid = true;
    this.showDelegateButton = false;
    this.tabs.length = 0;
    this.listOfEmployeesToRestrictAsReviewers.push(this.selectedEmployee.id);
    this.getSelectedEmployeeIdExisitingReviewers();


  }

  public tabClick(event: any) {
    this.selectedTabReviewerName = event.tab.textLabel;
    this.displayTableColumnActions = false;
    this.columns = this.displayedColumns;
    this.defaultParam.pageNumber = 0;
    this.defaultParam.pageSize = 10;
    this.pageSize = 10;
    this.pageIndex = 0;

    if (this.selectedTabReviewerName == this.selectedEmployee.firstName) {
      this.displayTableWithNoActions = false;
      this.displayTableWithActions = true;
      this.columns = this.displayedColumnsForEmployeeToBeApproved;
      this.getEmployeeSkillHistory();
      this.displayTableColumnActions = true;
    } else {
      this.retrieveExisitingReviewerId();
      this.displayTableWithNoActions = true;
      this.displayTableWithActions = false;
    }
  }

  private retrieveExisitingReviewerId(): void {
    this.selectedExisitingReviewer = this.selectedEmployeeIdExistingReviewerList.filter(reviewer => reviewer.firstName == this.selectedTabReviewerName);
    this.getSelectedEmployeeReviewerSkillHistory(this.selectedExisitingReviewer[0].id, this.defaultParam);
  }

  private getSelectedEmployeeReviewerSkillHistory(reviewerId: number, param: any): void {
    this.managerApiService.findEmployeeSkillHistoryByReviewerId(this.selectedEmployee.id, reviewerId, param).subscribe(
      skillHistoryResponse => {
        this.skillHistoryArray = skillHistoryResponse.content;
        this.dataSource = new MatTableDataSource(this.skillHistoryArray);
        this.totalElements = skillHistoryResponse.totalElements;
        this.dataSource.sort = this.sort;
      }
    );
  }

  private getSelectedEmployeeIdExisitingReviewers(): void {
    this.managerApiService.findAssignedReviewersByEmployeeId(this.selectedEmployee.id).subscribe(
      (reviewers) => {
        this.selectedEmployeeIdExistingReviewerList = reviewers.content;
        this.fillInTabs();
      },
      (error) => {
      },
      () => {
        this.getReviewersList();
      });
  }

  private getManagerEmployeeList(): void {
    this.defaultParam.sortOrder = 'ASC';
    this.managerApiService.searchManagersEmployees(this.stateService.loggedInUser.id, this.defaultParam).subscribe((employeesByManagerIdList) => {
        this.managerEmployeesList = employeesByManagerIdList.content;
      }
    );
  }

  private fillInTabs(): void {
    this.tabs.push(this.selectedEmployee.firstName);
    for (var index = 0; index < this.selectedEmployeeIdExistingReviewerList.length; index++) {
      this.tabs.push(this.selectedEmployeeIdExistingReviewerList[index].firstName);
      this.listOfEmployeesToRestrictAsReviewers.push(this.selectedEmployeeIdExistingReviewerList[index].id);
    }
  }

  private getReviewersList(): void {
    let param = {
      sortOrder: 'ASC',
      sortBy: 'firstName',
      pageNumber: 0,
      pageSize: 10000,
      managerId: this.stateService.loggedInUser.id,
      employeeId: this.listOfEmployeesToRestrictAsReviewers
    }


    this.managerApiService.searchEmployees(param).subscribe((reviewers) => {
      this.futureReviewersList = reviewers.content;
    })
  }

  public toggleDelegation(): void {
    this.showDelegateOptions = !this.showDelegateOptions;
  }


  public sortData(event: any) {
    let param = {
      sortOrder: event.direction,
      sortBy: event.active,
      pageNumber: this.pageIndex,
      pageSize: this.pageSize,
      skillHistoryStatus: 'PENDING'
    };

    if (this.selectedTabReviewerName == this.selectedEmployee.firstName) {
      this.managerApiService
        .searchEmployeeSkillHistory(this.selectedEmployee.id, SkillStatus.PENDING, param)
        .subscribe((skillHistoryResponse) => {
          this.skillHistoryArray = skillHistoryResponse.content;
          this.dataSource = new MatTableDataSource(this.skillHistoryArray);
          this.totalElements = skillHistoryResponse.totalElements;
          this.dataSource.sort = this.sort;
        });
    } else {
      this.selectedExisitingReviewer = this.selectedEmployeeIdExistingReviewerList.filter(reviewer => reviewer.firstName == this.selectedTabReviewerName);
      this.getSelectedEmployeeReviewerSkillHistory(this.selectedExisitingReviewer[0].id, param);
    }
  }

  private getEmployeeSkillHistory(): void {
    this.defaultParam.pageSize = 10;
    this.defaultParam.sortBy = "updatedOn";
    this.managerApiService
      .searchEmployeeSkillHistory(this.selectedEmployee.id, SkillStatus.PENDING, this.defaultParam)
      .subscribe((skillHistoryResponse) => {
        this.skillHistoryArray = skillHistoryResponse.content;
        this.dataSource = new MatTableDataSource(this.skillHistoryArray);
        this.totalElements = skillHistoryResponse.totalElements;
        this.dataSource.sort = this.sort;
        if (this.skillHistoryArray.length == 0) {
          this.showDelegateButton = true;
        }
      });
  }

  public onPaginateChange(event: PageEvent) {
    let page = event.pageIndex;
    this.pageIndex = event.pageIndex;
    let size = event.pageSize;
    this.pageSize = size;
    this.defaultParam.pageNumber = page;
    this.defaultParam.pageSize = size;

    if (this.selectedTabReviewerName == this.selectedEmployee.firstName) {
      this.managerApiService
        .searchEmployeeSkillHistory(this.selectedEmployee.id, SkillStatus.PENDING, this.defaultParam)
        .subscribe((skillHistoryResponse) => {
          this.skillHistoryArray = skillHistoryResponse.content;
          this.dataSource = new MatTableDataSource(this.skillHistoryArray);
          this.totalElements = skillHistoryResponse.totalElements;
          this.dataSource.sort = this.sort;
        });
    } else {
      this.selectedExisitingReviewer = this.selectedEmployeeIdExistingReviewerList.filter(reviewer => reviewer.firstName == this.selectedTabReviewerName);
      this.getSelectedEmployeeReviewerSkillHistory(this.selectedExisitingReviewer[0].id, this.defaultParam);
    }
  }

  public approveSkill(skillHistoryElement: any) {
    let param: SkillHistoryReviewUpdateRequest = {
      status: SkillStatus.APPROVED,
      comments: ''
    }

    this.managerApiService.updateSkillHistory(this.selectedEmployee.id, skillHistoryElement.id, param).subscribe(
      skillHistory => {
        this.toastr.success('Successfully approved!');
      },
      error => {
        this.toastr.error(error.error.message);
      },
      () => {
        this.checkTabsRefresh();
      }
    );
  }

  public deleteConfirmation(skillHistoryId: number): void {
    this.commentModalService.openDialog().subscribe(data => {
      if (data.comments !== undefined) this.declineSkillHistory(skillHistoryId, data.comments);
    });
  }

  private declineSkillHistory(skillHistoryId: number, comments: string): void {
    let param: SkillHistoryReviewUpdateRequest = {
      status: SkillStatus.DECLINED,
      comments: comments
    }
    this.managerApiService.updateSkillHistory(this.selectedEmployee.id, skillHistoryId, param).subscribe(
      result => {
        this.toastr.success('Successfully declined!');
      },
      error => {
        this.toastr.error(error.error.message);
      },
      () => {
        this.checkTabsRefresh();
      });
  }

  public assignReviewers(): void {

    this.managerApiService.assignReviewer(this.selectedEmployee.id, this.chosenReviewersForDelegation).subscribe(
      result => {
        this.toastr.success('Successfully added as reviewers!');
      },
      error => {
        this.toastr.error(error.error.message);
      },
      () => {
        this.showDelegateOptions = !this.showDelegateOptions;
        this.updateTabs();
      }
    );
  }

  private updateTabs(): void {
    this.getEmployeeSkillHistory();
    this.tabs.length = 0;
    this.getSelectedEmployeeIdExisitingReviewers();
    this.chosenReviewersForDelegation.length = 0;
    this.sendReviewersMail = true;
  }

  private checkTabsRefresh(): void {
    if (this.skillHistoryArray.length - 1 <= 0) {
      this.updateTabs();
    } else {
      this.getEmployeeSkillHistory();
    }
  }

  public onClose() {
    this.searchReviewerByName = "";
  }

}
