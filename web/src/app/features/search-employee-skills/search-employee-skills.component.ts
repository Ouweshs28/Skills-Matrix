import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {EmployeeDomainResponse, EmploymentPosition, Factory} from "../../shared/model/model";
import {EmployeeApiService} from "../../shared/services/api/employee/employee-api.service";
import {SkillApiService} from "../../shared/services/api/skill/skill-api.service";
import {LiveAnnouncer} from "@angular/cdk/a11y";
import {MatLegacyTableDataSource as MatTableDataSource} from "@angular/material/legacy-table";
import {MatSort} from "@angular/material/sort";
import {LegacyPageEvent as PageEvent} from "@angular/material/legacy-paginator";
import {Params, Router} from "@angular/router";
import {
  EmployeeSearchFilterDialogComponent
} from "../../shared/employee-search-filter-dialog/employee-search-filter-dialog.component";
import {MatLegacyDialog as MatDialog} from "@angular/material/legacy-dialog";
import {HttpParams} from "@angular/common/http";
import {ManagerApiService} from "../../shared/services/api/manager/manager-api.service";

@Component({
  selector: 'app-search-employee-skills',
  templateUrl: './search-employee-skills.component.html',
  styleUrls: ['./search-employee-skills.component.scss']
})
export class SearchEmployeeSkillsComponent implements OnInit {
  @ViewChild(MatSort) sort!: MatSort;
  // @ts-ignore
  @Input() employeeName!: string = "";
  public factory: string = "";
  public skillLevels = [];
  public domains = [];
  public factoryList: string[] = Factory.keys();
  public PositionEnum: any = EmploymentPosition;
  // @ts-ignore
  public employeeDomainList: EmployeeDomainResponse[] = [];

  public displayedColumns: string[] = ['firstName', 'lastName', 'position', 'factory', 'employeeDomain.name'];
  public employeeList: any;
  public pageIndex: number = 0;
  private defaultParam = {
    sortOrder: 'ASC',
    sortBy: 'firstName',
    pageNumber: 0,
    pageSize: 10,
  };
  public searchData: any;

  public totalElements!: number;
  public pageSize: number = 10;
  public pageEvent!: PageEvent;
  public sortBy: string = 'firstName';
  public sortOrder: string = 'ASC'


  constructor(private employeeServiceApi: EmployeeApiService,
              private skillServiceApi: SkillApiService,
              private _liveAnnouncer: LiveAnnouncer,
              private dialog: MatDialog,
              private route: Router,
              private managerServiceApi: ManagerApiService) {
  }

  ngOnInit(): void {
    this.defaultParam.sortBy = this.sortBy;
    this.getEmployees(this.defaultParam);
  }

  public toogleFilter() {
    let dialogRef = this.dialog.open(EmployeeSearchFilterDialogComponent, {data: this.searchData});
    dialogRef.afterClosed().subscribe(result => {
        this.searchData = result;
      },
      error => {
        console.log("Error");
      },
      () => {


        let params = new HttpParams();
        params = params.append('sortOrder', this.sortOrder)
          .append('sortBy', this.sortBy)
          .append('pageNumber', this.pageIndex)
          .append('pageSize', this.pageSize);

        if (this.employeeName !== "") {
          params = params.append('employeeName', this.employeeName);
        }

        if (this.searchData.factoryValue !== "") {

          this.factory = this.searchData.factoryValue;
          params = params.append('factory', this.factory);
        }

        if (this.searchData.domains !== undefined && this.searchData.domains.length !== 0) {

          this.domains = this.searchData.domains.map((domain: { id: number; }) => domain.id);
          // @ts-ignore
          params = params.append('domains', this.domains);
        }
        if (this.searchData.skillLevel.length != 0) {

          this.skillLevels = this.searchData.skillLevel.map((skill: { id: number; level: string }) => skill.id + '_' + skill.level);
          // @ts-ignore
          params = params.append('skillLevels', this.skillLevels);
        }


        this.getEmployees(params);
      }
    )
  }

  onPaginateChange(event: PageEvent) {
    let page = event.pageIndex;
    let size = event.pageSize;
    this.pageSize = size;
    this.pageIndex = page;

    let params = new HttpParams();
    params = params.append('sortOrder', this.sortOrder)
      .append('sortBy', this.sortBy)
      .append('pageNumber', this.pageIndex)
      .append('pageSize', this.pageSize);

    if (this.employeeName !== "") {
      params = params.append('employeeName', this.employeeName);
    }

    if (this.searchData.factoryValue !== "") {

      this.factory = this.searchData.factoryValue;
      params = params.append('factory', this.factory);
    }
    if (this.searchData.domains !== undefined && this.searchData.domains.length !== 0) {

      this.domains = this.searchData.domains.map((domain: { id: number; }) => domain.id);
      // @ts-ignore
      params = params.append('domains', this.domains);
    }
    if (this.searchData.skillLevel.length != 0) {

      this.skillLevels = this.searchData.skillLevel.map((skill: { id: number; level: string }) => skill.id + '_' + skill.level);
      // @ts-ignore
      params = params.append('skillLevels', this.skillLevels);
    }
    if (this.searchData.factoryValue !== "") {

      this.factory = this.searchData.factoryValue;
      params = params.append('factory', this.factory);
    }
    if (this.searchData.domains !== undefined) {

      this.domains = this.searchData.domains.map((domain: { id: number; }) => domain.id);
      // @ts-ignore
      params = params.append('domains', this.domains);
    }
    if (this.searchData.skillLevel.length != 0) {

      this.skillLevels = this.searchData.skillLevel.map((skill: { id: number; level: string }) => skill.id + '_' + skill.level);
      // @ts-ignore
      params = params.append('skillLevels', this.skillLevels);
    }

    this.getEmployees(params);
  }

  sortData(event: any) {
    this.sortBy = event.active
    this.sortOrder = event.direction;
    let params = new HttpParams();
    params = params.append('sortOrder', this.sortOrder)
      .append('sortBy', this.sortBy)
      .append('pageNumber', this.pageIndex)
      .append('pageSize', this.pageSize);

    if (this.employeeName !== "") {
      params = params.append('employeeName', this.employeeName);
    }

    if (this.searchData.factoryValue !== "") {

      this.factory = this.searchData.factoryValue;
      params = params.append('factory', this.factory);
    }
    if (this.searchData.domains !== undefined && this.searchData.domains.length !== 0) {

      this.domains = this.searchData.domains.map((domain: { id: number; }) => domain.id);
      // @ts-ignore
      params = params.append('domains', this.domains);
    }
    if (this.searchData.skillLevel.length != 0) {

      this.skillLevels = this.searchData.skillLevel.map((skill: { id: number; level: string }) => skill.id + '_' + skill.level);
      // @ts-ignore
      params = params.append('skillLevels', this.skillLevels);
    }
    if (this.searchData.factoryValue !== "") {

      this.factory = this.searchData.factoryValue;
      params = params.append('factory', this.factory);
    }
    if (this.searchData.domains !== undefined) {

      this.domains = this.searchData.domains.map((domain: { id: number; }) => domain.id);
      // @ts-ignore
      params = params.append('domains', this.domains);
    }
    if (this.searchData.skillLevel.length != 0) {

      this.skillLevels = this.searchData.skillLevel.map((skill: { id: number; level: string }) => skill.id + '_' + skill.level);
      // @ts-ignore
      params = params.append('skillLevels', this.skillLevels);
    }


    this.getEmployees(params);
  }

  public getEmployees(param: Params): void {
    this.managerServiceApi.searchEmployees(param).subscribe(
      (employee) => {
        this.employeeList = new MatTableDataSource(employee.content);
        this.totalElements = employee.totalElements;
        this.employeeList.sort = this.sort;
      });
  }

  public performSearch(): void {
    let params = new HttpParams();
    params = params.append('sortOrder', this.sortOrder)
      .append('sortBy', this.sortBy)
      .append('pageNumber', this.pageIndex)
      .append('pageSize', this.pageSize);
    if (this.employeeName !== "") {
      params = params.append('employeeName', this.employeeName);
    }

    if (!this.searchData == undefined) {
      if (this.searchData.factoryValue !== "") {

        this.factory = this.searchData.factoryValue;
        params = params.append('factory', this.factory);
      }
      if (this.searchData.domains !== undefined && this.searchData.domains.length !== 0) {

        this.domains = this.searchData.domains.map((domain: { id: number; }) => domain.id);
        // @ts-ignore
        params = params.append('domains', this.domains);
      }
      if (this.searchData.skillLevel.length != 0) {

        this.skillLevels = this.searchData.skillLevel.map((skill: { id: number; level: string }) => skill.id + '_' + skill.level);
        // @ts-ignore
        params = params.append('skillLevels', this.skillLevels);
      }
      if (this.searchData.factoryValue !== "") {

        this.factory = this.searchData.factoryValue;
        params = params.append('factory', this.factory);
      }
      if (this.searchData.domains !== undefined) {

        this.domains = this.searchData.domains.map((domain: { id: number; }) => domain.id);
        // @ts-ignore
        params = params.append('domains', this.domains);
      }
      if (this.searchData.skillLevel.length != 0) {

        this.skillLevels = this.searchData.skillLevel.map((skill: { id: number; level: string }) => skill.id + '_' + skill.level);
        // @ts-ignore
        params = params.append('skillLevels', this.skillLevels);
      }
    }
    this.getEmployees(params);
  }

  public getEmployeeSkill(event: any): void {
    this.route.navigate(['employee/' + event + '/skills']);
  }

}
