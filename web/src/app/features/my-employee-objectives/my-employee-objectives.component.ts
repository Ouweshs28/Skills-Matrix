import {AfterContentInit, Component, ViewChild} from '@angular/core';
import {LegacyPageEvent as PageEvent} from "@angular/material/legacy-paginator";
import {EmployeeApiService} from "../../shared/services/api/employee/employee-api.service";
import {MatLegacyTableDataSource as MatTableDataSource} from "@angular/material/legacy-table";
import {SkillLevel, SkillObjectiveResponse, SkillObjectiveStatus} from "../../shared/model/model";
import {MatSort} from "@angular/material/sort";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {ManagerApiService} from "../../shared/services/api/manager/manager-api.service";

@Component({
  selector: 'app-my-employee-skills',
  templateUrl: './my-employee-objectives.component.html',
  styleUrls: ['./my-employee-objectives.component.scss']
})
export class MyEmployeeObjectivesComponent implements AfterContentInit {
  displayedColumns: string[] = ['skill.name', 'skill.skillCategory.name', 'skill.employeeDomain.name', 'currentSkillLevel', 'targetSkillLevel', 'targetDate'];
  @ViewChild(MatSort) sort!: MatSort;
  totalElements!: number;
  pageSize: number = 10;
  public pageEvent!: PageEvent;
  sortBy: string = 'skill.name';
  sortOrder: string = 'ASC'
  pageIndex: number = 0;
  SkillLevelEnum: any = SkillLevel;
  // @ts-ignore
  public tabs: string[] = Object.values(SkillObjectiveStatus).map(k => SkillObjectiveStatus[k])
  public selectedTabStatus: string = "NEW";

  public skillObjectiveList: SkillObjectiveResponse[];
  private defaultParam = {
    sortOrder: this.sortOrder,
    sortBy: this.sortBy,
    pageNumber: 0,
    pageSize: 10,
    searchCriteria: '',
    status: this.selectedTabStatus
  };
  private currentUserSessionId: number;
  public employeePage: boolean = false;
  public employeeName: string;

  constructor(private employeeServiceApi: EmployeeApiService,
              private managerServiceApi: ManagerApiService,
              private route: Router,
              private aroute: ActivatedRoute) {
  }

  ngAfterContentInit(): void {
    // @ts-ignore
    if (!this.route.url.includes("employee")) {
      //this.currentUserSessionId = this.auth.getUserId();
      this.employeePage = true;
    } else {
      this.currentUserSessionId = this.aroute.snapshot.params['id'];
      this.getEmployeeName();
    }

    this.getEmployeeSkillsObjective(this.defaultParam);

  }

  onPaginateChange(event: PageEvent) {
    let page = event.pageIndex;
    let size = event.pageSize;
    this.pageSize = size;
    this.pageIndex = page;
    let param = {
      sortOrder: this.sortOrder,
      sortBy: this.sortBy,
      pageNumber: page,
      pageSize: size
    };

    this.getEmployeeSkillsObjective(param);
  }

  sortData(event: any) {
    this.sortBy = event.active;

    this.sortOrder = event.direction;
    let param = {
      sortOrder: this.sortOrder,
      sortBy: this.sortBy,
      pageNumber: this.pageIndex,
      pageSize: this.pageSize,
    };
    this.getEmployeeSkillsObjective(param);
  }

  public tabClick(tab: any) {

    this.selectedTabStatus = tab.tab.textLabel.toUpperCase();
    this.defaultParam.status = this.selectedTabStatus;
    this.getEmployeeSkillsObjective(this.defaultParam);
  }

  private getEmployeeSkillsObjective(param: Params): void {
    this.employeeServiceApi.searchObjectives(param).subscribe(
      (skillObjective) => {
        // @ts-ignore
        this.skillObjectiveList = new MatTableDataSource(skillObjective.content);
        this.totalElements = skillObjective.totalElements;
        // @ts-ignore
        this.skillObjectiveList.sort = this.sort;
      });
  }

  public getEmployeeName(): void {
    this.managerServiceApi.findEmployeeById(this.currentUserSessionId).subscribe(employee => {
      this.employeeName = employee.firstName + ' ' + employee.lastName + ' Objectives';
    })
  }
}
