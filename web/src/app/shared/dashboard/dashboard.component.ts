import {Component, OnInit} from '@angular/core';
import {SkillHistoryResponse, SkillLevel, SkillObjectiveResponse, SkillStatus} from "../model/model";
import {Params, Router} from "@angular/router";
import {EmployeeApiService} from "../services/api/employee/employee-api.service";
import {LegacyPageEvent as PageEvent} from "@angular/material/legacy-paginator";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  private currentUserSessionId: number;
  public currentObjectives: SkillObjectiveResponse[] = [];
  public currentObjectivesNum: number;
  public currentObjectivesColumns: string[] = ['name', 'domain', 'level', 'target date'];
  public requestColumns: string[] = ['name', 'domain', 'level'];
  public pendingRequest: SkillHistoryResponse[] = [];
  public pendingRequestNum: number;
  public approveRequest: SkillHistoryResponse[] = [];
  public approvedRequestNum: number;
  public declineRequest: SkillHistoryResponse[] = [];
  public declineRequestNum: number;
  public totalElements!: number;
  pageSize: number = 10;
  public pageEvent!: PageEvent;
  public sortBy: string = 'skill.name';
  public sortOrder: string = 'ASC'
  public pageIndex: number = 0;
  private defaultParam = {
    sortOrder: this.sortOrder,
    sortBy: this.sortBy,
    pageNumber: 0,
    pageSize: 4,
    objectiveStatus: 'NEW',
    skillHistoryStatus: ''
  };

  public SkillLevelEnum: any = SkillLevel;


  constructor(private route: Router, private employeeServiceApi: EmployeeApiService) {
  }

  ngOnInit(): void {
    this.getCurrentObjectives(this.defaultParam);
    this.getRequests(SkillStatus.APPROVED, this.defaultParam);
    this.getRequests(SkillStatus.PENDING, this.defaultParam);
    this.getRequests(SkillStatus.DECLINED, this.defaultParam);
  }

  private getCurrentObjectives(param: Params): void {

    this.employeeServiceApi.searchObjectives(param).subscribe(
      result => {

        this.currentObjectives = result.content
        this.currentObjectivesNum = result.totalElements;
      },
      error => {
        console.log("Error");
      },
      () => {
        console.log("Continue");
        this.setData();

      }
    );
  }


  private setData(): void {
    console.log(this.declineRequest)
  }

  private getRequests(skillHistoryStatus: SkillStatus, param: Params): void {
    param.skillHistoryStatus = skillHistoryStatus;
    this.employeeServiceApi.searchSkillHistory(param).subscribe(
      result => {
        switch (skillHistoryStatus) {
          case 'PENDING':
            this.pendingRequest = result.content
            this.pendingRequestNum = result.totalElements;
            break;
          case 'APPROVED':
            this.approveRequest = result.content;
            console.log(this.approveRequest)
            this.approvedRequestNum = result.totalElements;
            break;
          case 'DECLINED':
            this.declineRequest = result.content;
            this.declineRequestNum = result.totalElements;
            break;
        }
      },
      error => {
      },
      () => {
        this.setData();
      }
    );
  }

}
