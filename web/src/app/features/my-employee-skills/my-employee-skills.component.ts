import {AfterContentInit, Component, ViewChild} from '@angular/core';
import {MatSort} from "@angular/material/sort";
import {LegacyPageEvent as PageEvent} from "@angular/material/legacy-paginator";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {MatLegacyTableDataSource as MatTableDataSource} from "@angular/material/legacy-table";
import {EmployeeApiService} from "../../shared/services/api/employee/employee-api.service";
import {MatLegacyDialog as MatDialog} from "@angular/material/legacy-dialog";
import {EmployeeHistoryDialogComponent} from "../../shared/employee-history-dialog/employee-history-dialog.component";
import {
  EmployeeSkillResponse,
  SkillHistoryResponse,
  SkillLevel,
  SkillObjectiveCreateRequest,
  SkillObjectiveResponse,
  SkillObjectiveStatus,
  SkillObjectiveUpdateRequest,
} from "../../shared/model/model";
import {TargetModalService} from 'src/app/shared/services/target-modal/target-modal.service';
import {ToastrService} from 'ngx-toastr';
import {ManagerApiService} from "../../shared/services/api/manager/manager-api.service";
import {StateService} from "../../shared/services/state/state.service";

@Component({
  selector: 'app-my-employee-skills',
  templateUrl: './my-employee-skills.component.html',
  styleUrls: ['./my-employee-skills.component.scss']
})
export class MyEmployeeSkillsComponent implements AfterContentInit {
  @ViewChild(MatSort) sort!: MatSort;
  public searchCriteria: string = "";
  pageIndex: number = 0;
  private defaultParam = {
    sortOrder: 'ASC',
    sortBy: 'skill.name',
    pageNumber: 0,
    pageSize: 10,
    skillName: '',
    skillId: null
  };
  totalElements!: number;
  pageSize: number = 10;
  public pageEvent!: PageEvent;
  sortBy: string = 'skill.name';
  sortOrder: string = 'ASC'
  public employeeSkills: any;
  public employeeSkillsWithObjective: any = [];
  public displayedColumns: string[] = [];
  public showTargetutton: boolean;


  private currentUserSessionId: number;
  private skillHistory: SkillHistoryResponse[];
  public SkillLevelEnum: any = SkillLevel;
  public employeePage: boolean = false;
  public employeeName: string;
  public skillObjectiveCreateObject: SkillObjectiveCreateRequest;
  public skillObjectiveUpdateObject: SkillObjectiveUpdateRequest;
  public selectedEmployeeId: number;
  public selectedEmployeeIdManagerId: number;
  public employeeSkillObjectiveId!: number;

  constructor(private employeeServiceApi: EmployeeApiService,
              private managerServiceApi: ManagerApiService,
              private dialog: MatDialog,
              private aroute: ActivatedRoute,
              private route: Router,
              private toastr: ToastrService,
              private targetModalService: TargetModalService,
              private stateService: StateService) {
  }

  ngOnInit(): void {

  }

  private getUserSessionDetails(): void {
    if (this.stateService.loggedInUser != undefined) {
      this.currentUserSessionId = this.stateService.loggedInUser.id
    }
  }

  private checkForEmployeeORManagerView(): void {
    if (this.route.url.includes("my-skills")) {
      this.selectedEmployeeId = this.currentUserSessionId;
      this.employeePage = true;
      this.displayedColumns = ['skill.name', 'skill.description', 'skillLevel', 'skill.skillCategory.name', 'skill.employeeDomain.name'];
    } else {
      this.selectedEmployeeId = this.aroute.snapshot.params['id'];
      this.getEmployeeName();
      this.initialiseSkillObjectiveObject();
      this.displayedColumns = ['skill.name', 'skill.description', 'skillLevel', 'skill.skillCategory.name', 'skill.employeeDomain.name', 'targetDate'];
    }
    this.getEmployeeSkills(this.defaultParam);
  }

  public doAction(): void {
    if (this.route.url.includes("my-skills")) {
      this.route.navigate(["/employeeAssessment/"])
    } else {
      this.route.navigate(["/searchEmployeeSkills/"])
    }
  }

  public getEmployeeName(): void {
    this.managerServiceApi.findEmployeeById(this.selectedEmployeeId).subscribe(employee => {
        this.employeeName = employee.firstName + ' ' + employee.lastName + ' Skills';
        this.selectedEmployeeIdManagerId = employee.manager.id;
      },
      error => {
      },
      () => {
        this.checkDisplayTargetButton()
      })
  }


  public getEmployeeSkills(param: Params): void {
    if (this.employeePage) {
      console.log('employee api call')
      this.employeeServiceApi.findEmployeeSkills(param).subscribe(
        (employee) => {
          this.employeeSkills = new MatTableDataSource(employee.content);
          this.totalElements = employee.totalElements;
          this.employeeSkills.sort = this.sort;
        });
    } else {
      console.log('manager api call')
      this.managerServiceApi.findEmployeeSkills(this.selectedEmployeeId, param).subscribe(
        (employee) => {
          this.employeeSkills = new MatTableDataSource(employee.content);
          this.employeeSkills = employee.content;
          this.totalElements = employee.totalElements;
          this.employeeSkills.sort = this.sort;
        },
        error => {
          console.log(error)
        });

    }

  }

  private checkDisplayTargetButton(): void {
    if (this.selectedEmployeeIdManagerId == this.currentUserSessionId) {
      this.showTargetutton = true;
    }
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
      pageSize: size,
      skillName: this.searchCriteria
    };
    this.getEmployeeSkills(param)
  }

  sortData(event: any) {
    this.sortBy = event.active
    this.sortOrder = event.direction;
    let param = {
      sortOrder: this.sortOrder,
      sortBy: this.sortBy,
      pageNumber: this.pageIndex,
      pageSize: this.pageSize,
      skillName: this.searchCriteria
    };
    this.getEmployeeSkills(param);

  }

  searchSkill() {
    let param = {
      sortOrder: this.sortOrder,
      sortBy: this.sortBy,
      pageNumber: this.pageIndex,
      pageSize: this.pageSize,
      skillName: this.searchCriteria
    };
    this.getEmployeeSkills(param);
  }

  public getEmployeeSkillHistoryData(event: any) {
    this.defaultParam.sortBy = "skill.name"
    this.defaultParam.skillId = event.skill.id;
    this.employeeServiceApi.searchSkillHistory(this.defaultParam).subscribe(
      result => {
        this.skillHistory = result.content;
      },
      error => {
        console.log("Error");
      },
      () => {
        let dialog = this.dialog.open(EmployeeHistoryDialogComponent, {
          data: {
            id: this.selectedEmployeeId,
            skillId: event.skill.id,
            name: event.skill.name,
            content: this.skillHistory,
          },
        });
        this.defaultParam.skillId = null;
      }
    );
  }

  public openTargetDialog(event: EmployeeSkillResponse): void {
    let title: string;
    let objective: SkillObjectiveResponse = new SkillObjectiveResponse();
    if (event.currentObjectiveId !== null) {
      title = "Update";
      this.employeeSkillObjectiveId = event.currentObjectiveId;
      this.managerServiceApi.findSkillObjectiveById(this.selectedEmployeeId, this.employeeSkillObjectiveId)
        .subscribe((skillObjective) => {
            objective = skillObjective;
          }, error => {
            console.log(error)
          },
          () => {
            console.log("completed");
            console.log(objective)
            this.callModalTargetService(objective, title);
          }
        )
    } else {
      title = "Set";
      objective.skill = event.skill;
      objective.currentSkillLevel = event.skillLevel
      // @ts-ignore
      objective.targetSkillLevel = null;
      // @ts-ignore
      objective.targetDate = null;
      this.callModalTargetService(objective, title);
    }
  }


  private callModalTargetService(objective: SkillObjectiveResponse, title: string): void {
    this.targetModalService.openDialog(objective, title).subscribe(data => {
      console.log(data)
      if (data.objective) {
        if (title == "Set") {
          this.setEmployeeObjective(data.objective);
        } else {
          this.updateEmployeeObjective(data.objective);
        }
      }
      this.managerServiceApi.findEmployeeSkills(this.selectedEmployeeId, this.defaultParam).subscribe(
        (employee) => {
          this.employeeSkills = new MatTableDataSource(employee.content);
          this.employeeSkills = employee.content;
          this.totalElements = employee.totalElements;
          this.employeeSkills.sort = this.sort;
        },
        error => {
          console.log(error)
        });
    });

  }

  private setEmployeeObjective(data: any): void {
    console.log(data)
    this.skillObjectiveCreateObject = {
      skillId: data.skill.id,
      targetSkillLevel: data.targetSkillLevel,
      targetDate: data.targetDate.toLocaleDateString('en-CA')
    }
    console.log(this.skillObjectiveCreateObject);

    this.managerServiceApi.createSkillObjective(this.selectedEmployeeId, this.skillObjectiveCreateObject).subscribe(
      result => {
        this.toastr.success("Target has been successfully set for " + this.employeeName);
      },
      error => {
        this.toastr.error(error.error.message);
      }
    );
    this.getEmployeeSkills(this.defaultParam);
  }

  private updateEmployeeObjective(data: any): void {
    console.log(data)
    this.skillObjectiveUpdateObject = {
      targetSkillLevel: data.targetSkillLevel,
      targetDate: data.targetDate,
      status: SkillObjectiveStatus.NEW
    }

    this.managerServiceApi.updateSkillObjective(this.selectedEmployeeId, this.employeeSkillObjectiveId, this.skillObjectiveUpdateObject).subscribe(
      result => {
        this.toastr.success("Target has been successfully updated for " + this.employeeName);
      },
      error => {
        this.toastr.error(error.error.message);
      }
    );
    this.getEmployeeSkills(this.defaultParam);
  }

  private initialiseSkillObjectiveObject(): void {
    this.skillObjectiveCreateObject = {
      skillId: 0,
      //@ts-ignore
      currentSkillLevel: null,
      //@ts-ignore
      targetSkillLevel: null,
      //@ts-ignore
      targetDate: null,
      status: SkillObjectiveStatus.NEW
    }
  }

  ngAfterContentInit(): void {
    this.getUserSessionDetails();
    this.checkForEmployeeORManagerView();
  }

}
