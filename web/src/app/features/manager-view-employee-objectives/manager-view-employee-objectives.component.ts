import {AfterContentInit, Component, ViewChild} from '@angular/core';
import {LegacyPageEvent as PageEvent} from '@angular/material/legacy-paginator';
import {
  ManagerResponse,
  SkillLevel,
  SkillObjectiveResponse,
  SkillObjectiveStatus,
  SkillObjectiveUpdateRequest
} from 'src/app/shared/model/model';
import {EmployeeApiService} from 'src/app/shared/services/api/employee/employee-api.service';
import {MatSort} from '@angular/material/sort';
import {MatLegacyTableDataSource as MatTableDataSource} from '@angular/material/legacy-table';
import {ToastrService} from 'ngx-toastr';
import {ManagerApiService} from "../../shared/services/api/manager/manager-api.service";
import {StateService} from "../../shared/services/state/state.service";

@Component({
  selector: 'app-manager-view-employee-objectives',
  templateUrl: './manager-view-employee-objectives.component.html',
  styleUrls: ['./manager-view-employee-objectives.component.scss']
})
export class ManagerViewEmployeeObjectivesComponent implements AfterContentInit {

  public searchEmployeeByName!: string;
  public employeesList: ManagerResponse[] = [];
  public tempEmployeeName: string = '';
  public SkillLevelEnum: any = SkillLevel;
  public hasSelectedAnEmployee: boolean;
  public selectedEmployeeId: number;
  public dataSource!: any;
  public totalElements!: number;
  public pageSize: number = 10;
  public pageEvent!: PageEvent;
  public pageIndex: number = 0;
  public skillObjectivesArray: SkillObjectiveResponse[];
  public disableAddObjectiveButton: boolean = true;
  public today: any;
  public before: any;
  @ViewChild(MatSort) sort!: MatSort;

  public displayedColumns = ['employee.firstName', 'skill.name', 'currentSkillLevel', 'targetSkillLevel', 'targetDate', 'actions'];

  private defaultParam = {
    sortOrder: 'ASC',
    sortBy: 'employee.firstName',
    pageNumber: 0,
    pageSize: 10,
    objectiveStatus: SkillObjectiveStatus.NEW,
    dateFrom: ''
  };

  constructor(private employeeApiService: EmployeeApiService,
              private toastr: ToastrService,
              private managerApiService: ManagerApiService,
              private stateService: StateService) {
  }

  ngAfterContentInit(): void {
    this.today = new Date();
    this.before = new Date();
    this.before.setFullYear(this.today.getYear() - 4);
    this.populateEmployeeList(this.tempEmployeeName);
    this.populateSkillObjectiveTable();
  }


  public getEmployeeSelected(event: any): void {
    this.hasSelectedAnEmployee = true;
    this.selectedEmployeeId = event.value.id;
    this.disableAddObjectiveButton = false;
    this.populateSkillObjectiveTable();
  }

  public employeeNameOnKeyUp(event: any): void {
    this.populateEmployeeList(event.target.value);
  }

  private populateEmployeeList(employeeName: string): void {
    let param = {
      sortOrder: 'ASC',
      sortBy: 'firstName',
      pageNumber: 0,
      pageSize: 10000,
      employeeName: employeeName,
      objectiveStatus: ''
    };
    this.managerApiService.searchManagersEmployees(this.stateService.loggedInUser.id, param).subscribe(
      (employees) => {
        this.employeesList = employees.content;
      }
    );
  }

  private populateSkillObjectiveTable(): void {
    if (!this.hasSelectedAnEmployee) {
      this.getAllEmployeesSkillObjectives()
    } else {
      this.getEmployeeSkillObjectivesByEmployeeId(this.selectedEmployeeId);
    }
  }

  private getAllEmployeesSkillObjectives(): void {
    this.managerApiService.searchAllObjectives(this.defaultParam).subscribe(
      (skillObjectivesResponse) => {
        console.log(skillObjectivesResponse.content)
        this.skillObjectivesArray = skillObjectivesResponse.content;
        this.dataSource = new MatTableDataSource(this.skillObjectivesArray);
        this.totalElements = skillObjectivesResponse.totalElements;
        this.dataSource.sort = this.sort;
      },
      error => {
        console.log(error.error.message)
      }
    );
  }

  private getEmployeeSkillObjectivesByEmployeeId(employeeId: number): void {
    this.managerApiService.searchObjectives(employeeId, this.defaultParam).subscribe(
      (skillObjectivesResponse) => {
        this.skillObjectivesArray = skillObjectivesResponse.content;
        this.dataSource = new MatTableDataSource(this.skillObjectivesArray);
        this.totalElements = skillObjectivesResponse.totalElements;
        this.dataSource.sort = this.sort;
      }
    );
  }

  public markSkillObjectiveAsComplete(skillObjectiveResponse: SkillObjectiveResponse): void {
    let skillObjectiveUpdateRequest = new SkillObjectiveUpdateRequest();
    skillObjectiveUpdateRequest.status = SkillObjectiveStatus.COMPLETE;
    skillObjectiveUpdateRequest.targetSkillLevel = skillObjectiveResponse.targetSkillLevel;
    skillObjectiveUpdateRequest.targetDate = skillObjectiveResponse.targetDate;

    this.managerApiService.updateSkillObjective(skillObjectiveResponse.employee.id, skillObjectiveResponse.id, skillObjectiveUpdateRequest).subscribe(
      (response) => {
        this.toastr.success("Objective successfully marked as complete!");
      },
      (error) => {
        this.toastr.error(error.error.message);
      },
      () => {
        this.skillObjectivesArray = this.skillObjectivesArray.filter(
          (skillObjective) => skillObjective.id !== skillObjectiveResponse.id
        );
        this.dataSource = new MatTableDataSource(this.skillObjectivesArray);
        this.dataSource.sort = this.sort;
        this.totalElements = this.skillObjectivesArray.length;
      }
    );
  }

  public markSkillObjectiveAsInComplete(skillObjectiveResponse: SkillObjectiveResponse): void {
    let skillObjectiveUpdateRequest = new SkillObjectiveUpdateRequest();
    skillObjectiveUpdateRequest.status = SkillObjectiveStatus.INCOMPLETE;
    skillObjectiveUpdateRequest.targetSkillLevel = skillObjectiveResponse.targetSkillLevel;
    skillObjectiveUpdateRequest.targetDate = skillObjectiveResponse.targetDate;

    this.managerApiService.updateSkillObjective(skillObjectiveResponse.employee.id, skillObjectiveResponse.id, skillObjectiveUpdateRequest).subscribe(
      (response) => {
        this.toastr.success("Objective successfully marked as incomplete!");
      },
      (error) => {
        this.toastr.error(error.error.message);
      },
      () => {
        this.skillObjectivesArray = this.skillObjectivesArray.filter(
          (skillObjective) => skillObjective.id !== skillObjectiveResponse.id
        );
        this.dataSource = new MatTableDataSource(this.skillObjectivesArray);
        this.dataSource.sort = this.sort;
        this.totalElements = this.skillObjectivesArray.length;
      }
    );
  }


  public sortData(event: any): void {
    this.defaultParam.sortOrder = event.direction;
    this.defaultParam.sortBy = event.active;
    this.defaultParam.pageNumber = this.pageIndex;
    this.defaultParam.pageSize = this.pageSize;
    this.populateSkillObjectiveTable();
  }

  public onPaginateChange(event: any) {
    let page = event.pageIndex;
    let size = event.pageSize;
    this.pageSize = size;
    this.pageIndex = page;
    this.defaultParam.pageNumber = page;
    this.defaultParam.pageSize = size;
    this.populateSkillObjectiveTable();
  }

  public onClose() {
    this.searchEmployeeByName = "";
    this.populateEmployeeList(this.searchEmployeeByName);

  }

  openDatePicker(dp: any) {
    dp.open();
  }

  closeDatePicker(eventData: any, dp ?: any) {
    this.defaultParam.dateFrom = eventData.toLocaleDateString('en-CA');
    this.populateSkillObjectiveTable();

  }

}
