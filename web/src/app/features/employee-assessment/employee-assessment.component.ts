import {Component, OnInit, ViewChild} from '@angular/core';
import {MatLegacyDialog as MatDialog} from '@angular/material/legacy-dialog';
import {EmployeeApiService} from 'src/app/shared/services/api/employee/employee-api.service';
import {SkillHistoryResponse, SkillLevel, SkillStatus,} from 'src/app/shared/model/model';
import {MatSort} from '@angular/material/sort';
import {MatLegacyTableDataSource as MatTableDataSource} from '@angular/material/legacy-table';
import {LegacyPageEvent as PageEvent} from '@angular/material/legacy-paginator';
import {WarningDialogComponent} from 'src/app/shared/warning-dialog/warning-dialog.component';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {StateService} from "../../shared/services/state/state.service";

@Component({
  selector: 'app-employee-assessment',
  templateUrl: './employee-assessment.component.html',
  styleUrls: ['./employee-assessment.component.scss'],
})
export class EmployeeAssessmentComponent implements OnInit {
  @ViewChild(MatSort) sort!: MatSort;
  public displayedColumns: string[] = ['skill.name', 'skillLevel', 'comments', 'actions'];
  public dataSource!: any;
  public SkillLevelEnum: any = SkillLevel;
  public StatusEnum: any = SkillStatus;
  public skillHistoryArray: SkillHistoryResponse[];
  public totalElements!: number;
  public pageSize: number = 10;
  public pageEvent!: PageEvent;
  public pageIndex: number = 0;
  public tabs = ['Approved', 'Pending', 'Declined'];
  public selectedTabStatus: string = 'APPROVED';
  public searchCriteria!: string;
  public currentUserSessionId!: number;
  private defaultParam = {
    sortOrder: 'DESC',
    sortBy: 'updatedOn',
    pageNumber: 0,
    pageSize: 10,
    keyword: '',
    skillHistoryStatus: ''

  };

  constructor(
    private dialog: MatDialog,
    private toastr: ToastrService,
    private employeeApiService: EmployeeApiService,
    private router: Router,
    private stateService: StateService
  ) {
  }

  ngOnInit(): void {
    this.getEmployeeSkillHistory();
  }


  public onKeyUpEvent(event: any) {
    this.generateTableItemsBasedOnSearchCriteria(event);
  }

  public tabClick(tab: any) {
    this.selectedTabStatus = tab.tab.textLabel.toUpperCase();
    this.getEmployeeSkillHistory();
  }

  public deleteConfirmation(skillHistoryId: number): void {
    let dialogRef = this.dialog.open(WarningDialogComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteSkill(skillHistoryId);
      }
    });
  }

  public onPaginateChange(event: PageEvent) {
    let page = event.pageIndex;
    let size = event.pageSize;
    this.pageSize = size;
    this.pageIndex = page;
    this.defaultParam.pageNumber = page;
    this.defaultParam.pageSize = size;
    if (this.searchCriteria !== undefined) this.defaultParam.keyword = this.searchCriteria;
    this.defaultParam.skillHistoryStatus = this.getCurrentSelectedTabSkillStatus();
    this.employeeApiService
      .searchSkillHistory(this.defaultParam)
      .subscribe((skillHistoryResponse) => {
        this.skillHistoryArray = skillHistoryResponse.content;
        this.dataSource = new MatTableDataSource(this.skillHistoryArray);
      });
  }

  public sortData(event: any) { //resolve here
    if (this.searchCriteria === undefined) {
      let param = {
        sortOrder: event.direction,
        sortBy: event.active,
        pageNumber: this.pageIndex,
        pageSize: this.pageSize,
        skillHistoryStatus: this.getCurrentSelectedTabSkillStatus()
      };
      this.employeeApiService
        .searchSkillHistory(param)
        .subscribe(
          (skillHistoryResponse) => {
            this.skillHistoryArray = skillHistoryResponse.content;
            this.dataSource = new MatTableDataSource(this.skillHistoryArray);
          },
          (error) => console.log(error)
        );
    } else {
      let param = {
        sortOrder: event.direction,
        sortBy: event.active,
        pageNumber: this.pageIndex,
        pageSize: this.pageSize,
        keyword: this.searchCriteria,
        skillHistoryStatus: this.getCurrentSelectedTabSkillStatus()
      };
      this.employeeApiService
        .searchSkillHistory(param)
        .subscribe((skillHistoryResponse) => {
          this.skillHistoryArray = skillHistoryResponse.content;
          this.dataSource = new MatTableDataSource(this.skillHistoryArray);
        });
    }
  }

  private getEmployeeSkillHistory(): void {
    this.defaultParam.skillHistoryStatus = this.getCurrentSelectedTabSkillStatus();
    this.employeeApiService
      .searchSkillHistory(this.defaultParam)
      .subscribe((skillHistoryResponse) => {
        this.skillHistoryArray = skillHistoryResponse.content;
        this.dataSource = new MatTableDataSource(this.skillHistoryArray);
        this.totalElements = skillHistoryResponse.totalElements;
        this.dataSource.sort = this.sort;
      });
  }

  private deleteSkill(skillHistoryId: number) {
    this.employeeApiService.deleteSkillHistory(skillHistoryId).subscribe(
      () => {
        this.toastr.success('Successfully deleted!');
        this.skillHistoryArray = this.skillHistoryArray.filter(
          (skillHistory) => skillHistory.id !== skillHistoryId
        );
        this.dataSource = new MatTableDataSource(this.skillHistoryArray);
        this.dataSource.sort = this.sort;
        this.totalElements = this.skillHistoryArray.length;
      },
      (err) => this.toastr.error(err.error.message)
    );
  }

  private generateTableItemsBasedOnSearchCriteria(event: any) {
    let param = {
      keyword: event.target.value,
      sortOrder: 'DESC',
      sortBy: 'updatedOn',
      pageNumber: 0,
      skillHistoryStatus: this.getCurrentSelectedTabSkillStatus()
    };
    this.employeeApiService
      .searchSkillHistory(param)
      .subscribe((skillHistoryResponse) => {
        this.skillHistoryArray = skillHistoryResponse.content;
        this.dataSource = new MatTableDataSource(this.skillHistoryArray);
      });
  }

  private getCurrentSelectedTabSkillStatus(): SkillStatus {

    if (this.selectedTabStatus == "APPROVED") {
      return SkillStatus.APPROVED;
    } else if (this.selectedTabStatus == "PENDING") {
      return SkillStatus.PENDING
    } else {
      return SkillStatus.DECLINED
    }


  }

  public navigateToUpdateComponent(data: any): void {
    this.stateService.skillHistoryResponse = data;
    this.router.navigate(["updateSkillAssessment"]);

  }


}
