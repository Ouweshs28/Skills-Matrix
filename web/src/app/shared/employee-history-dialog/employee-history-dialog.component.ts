import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {SkillLevel, SkillStatus} from "../model/model";
import {ManagerApiService} from "../services/api/manager/manager-api.service";

@Component({
  selector: 'app-employee-history-dialog',
  templateUrl: './employee-history-dialog.component.html',
  styleUrls: ['./employee-history-dialog.component.scss']
})
export class EmployeeHistoryDialogComponent implements OnInit {

  public objectivesColumns: string[] = [
    'currentSkillLevel',
    'targetSkillLevel',
    'targetDate',
    'status'
  ];

  public historyColumns: string[] = [
    'skillLevel',
    'status'
  ];
  private defaultParam = {
    sortOrder: 'ASC',
    sortBy: 'skill.name',
    pageNumber: 0,
    pageSize: 10,
    skillName: '',
    skillId: null
  };
  public tabs: string[] = ["History", "Objectives", "Documents"]
  public selectedTabStatus: string = "History";
  public SkillLevelEnum: any = SkillLevel;
  private employeeId: number;
  public skillName: string;
  public skillId: number;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private managerServiceApi: ManagerApiService) {
    console.log(this.data);
  }

  ngOnInit(): void {
    this.employeeId = this.data.id;
    this.skillId = this.data.skillId;
    this.skillName = this.data.name;


  }


  public tabClick(tab: any): void {

    this.selectedTabStatus = tab.tab.textLabel;
    switch (this.selectedTabStatus) {
      case "History":
        this.getEmployeeSkillHistoryData()
        break;
      case "Objectives":
        this.getEmployeeSkillObjectiveData();
        break;
      case "Documents":
        console.log("file upload XD");
        break;
    }
  }

  public getEmployeeSkillHistoryData() {
    this.defaultParam.sortBy = "skill.name";
    //@ts-ignore
    this.defaultParam.skillId = this.skillId;
    this.managerServiceApi.searchEmployeeSkillHistory(this.employeeId, SkillStatus.ALL, this.defaultParam).subscribe(
      result => {
        this.data.content = result.content;
      },
      error => {
        console.log("Error");
      },
      () => {
        console.log("Continue");
        console.log(this.data.content)
        this.defaultParam.skillId = null;

      });
  }

  public getEmployeeSkillObjectiveData() {
    this.defaultParam.sortBy = "skill.name"
    // @ts-ignore
    this.defaultParam.skillId = this.skillId;
    this.managerServiceApi.searchObjectives(this.employeeId, this.defaultParam).subscribe(
      result => {
        this.data.content = result.content;
      },
      error => {
        console.log("Error");
      },
      () => {
        console.log("Continue");
        console.log(this.data.content)

      });
  }


}
