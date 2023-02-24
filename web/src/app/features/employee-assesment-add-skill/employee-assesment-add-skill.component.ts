import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSort} from "@angular/material/sort";
import {SkillHistoryCreateRequest, SkillResponse} from "../../shared/model/model";
import {LegacyPageEvent as PageEvent} from "@angular/material/legacy-paginator";
import {SkillApiService} from "../../shared/services/api/skill/skill-api.service";
import {MatLegacyTableDataSource as MatTableDataSource} from "@angular/material/legacy-table";
import {SelectionModel} from "@angular/cdk/collections";
import {AddSkillLevelModalService} from "../../shared/services/add-skill-level-modal/add-skill-level-modal.service";
import {ToastrService} from "ngx-toastr";
import {EmployeeApiService} from "../../shared/services/api/employee/employee-api.service";
import {WarningDialogComponent} from "../../shared/warning-dialog/warning-dialog.component";
import {MatLegacyDialog as MatDialog} from "@angular/material/legacy-dialog";

@Component({
  selector: 'app-employee-assesment-add-skill',
  templateUrl: './employee-assesment-add-skill.component.html',
  styleUrls: ['./employee-assesment-add-skill.component.scss']
})
export class EmployeeAssesmentAddSkillComponent implements OnInit {
  @ViewChild(MatSort) sort!: MatSort;
  selection = new SelectionModel<Number>(true, []);
  public searchCriteria!: string;
  public displayedColumns: string[] = [
    'name',
    'description',
    'skillCategory',
    'skillDomain',
    'actions',
  ];
  public dataSource!: any;
  public skillArray: SkillResponse[] = [];
  public pageIndex: number = 0;
  public totalElements!: number;
  public pageSize: number = 10;
  public pageEvent!: PageEvent;
  private defaultParam = {
    sortOrder: 'ASC',
    sortBy: 'name',
    pageNumber: 0,
    pageSize: 10,
  };
  public skillHistoryArray: SkillHistoryCreateRequest[] = [];

  public checked: false;

  constructor(
    private skillApiService: SkillApiService,
    private addSkillLevelModalService: AddSkillLevelModalService,
    private toastr: ToastrService,
    private employeeApiService: EmployeeApiService,
    public dialog: MatDialog
  ) {
  }

  ngOnInit(): void {
    this.getAllSkills();
  }

  public onKeyupEvent(event: any) {
    this.generateTableItemsBasedOnSearchCriteria(event);
  }

  public sortData(event: any) {
    if (this.searchCriteria === undefined) {
      let param = {
        sortOrder: event.direction,
        sortBy: event.active,
        pageNumber: this.pageIndex,
        pageSize: this.pageSize,
      };
      this.skillApiService.searchSkills(param).subscribe(
        (skills) => {
          this.skillArray = skills.content;
          this.dataSource = new MatTableDataSource(this.skillArray);
          this.dataSource.sort = this.sort;
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
      };
      this.skillApiService.searchSkills(param).subscribe((skill) => {
        this.skillArray = skill.content;
        this.dataSource = new MatTableDataSource(this.skillArray);
        this.dataSource.sort = this.sort;
      });
    }
  }

  public onPaginateChange(event: PageEvent) {
    let page = event.pageIndex;
    let size = event.pageSize;
    this.pageSize = size;
    this.pageIndex = page;
    this.defaultParam.pageNumber = page;
    this.defaultParam.pageSize = size;
    this.skillApiService.searchSkills(this.defaultParam).subscribe((skill) => {
      this.skillArray = skill.content;
      this.dataSource = new MatTableDataSource(this.skillArray);

    });
    console.log(this.selection)
  }

  private getAllSkills(): void {
    this.defaultParam.sortBy = 'name';
    this.skillApiService.searchSkills(this.defaultParam).subscribe((skill) => {
      this.skillArray = skill.content;
      this.dataSource = new MatTableDataSource(this.skillArray);
      this.totalElements = skill.totalElements;
      this.dataSource.sort = this.sort;
    });
  }

  private generateTableItemsBasedOnSearchCriteria(event: any) {
    let param = {
      keyword: event.target.value,
      sortOrder: 'ASC',
      sortBy: 'name',
      pageNumber: 0,
      pageSize: this.pageSize,
    };
    this.skillApiService.searchSkills(param).subscribe((skill) => {
      this.skillArray = skill.content;
      this.dataSource = new MatTableDataSource(this.skillArray);
    });
  }

  public addSkillHistory(event: SkillResponse) {

    let skillHistoryCreate: SkillHistoryCreateRequest = new SkillHistoryCreateRequest()
    skillHistoryCreate.skillId = event.id;
    skillHistoryCreate.skillName = event.name;
    skillHistoryCreate.skillDescription = event.description;
    skillHistoryCreate.skillCategory = event.skillCategory.name;
    // @ts-ignore
    skillHistoryCreate.skillLevel = null;
    this.addSkillLevelModalService
      .openDialog(skillHistoryCreate).subscribe((data: any) => {
      console.log(data)
      if (data) {
        if (data.skillHistory.skillLevel == null) {
          return false;
        } else {
          console.log(data.skillHistory)
          this.skillHistoryArray.push(data.skillHistory);
          console.log(this.skillHistoryArray)
          return this.selection.toggle(event.id);
        }
      }
    })
  }

  public loopAddSkillHistoryService(index = 0) {
    //loop through the SkillHistoryAssessments variable and call the API one by one
    if (index < this.skillHistoryArray.length) {
      this.callAddSkillHistoryService(this.skillHistoryArray[index], index, () => {
        this.loopAddSkillHistoryService(++index);
      });
    }
    this.selection.clear();
  }

  public async callAddSkillHistoryService(skillHistoryRecord: SkillHistoryCreateRequest, index: number, callback: any = null): Promise<void> {
    this.employeeApiService.createSkillHistory(skillHistoryRecord)
      .subscribe(
        result => {
          this.toastr.success('Skill ' + skillHistoryRecord.skillName + ' successfully added for assessment!');
          if (callback != null) callback();
        },
        error => {
          this.toastr.error(error.error.message);
          if (callback != null) callback();
        },
        () => {
          //If good, retain form index in order to be removed from skill array form
          setTimeout(() => {

          }, 1000);
        }
      );
  }

  public updateSkillHistory(event: SkillResponse) {
    let skillHistoryUpdate = this.skillHistoryArray.find(target => target.skillId === event.id);
    this.addSkillLevelModalService
      .openDialog(skillHistoryUpdate).subscribe((data: any) => {
      console.log(data)
      if (data) {
        if (data.skillHistory.skillLevel == null) {
        } else {
          var foundIndex = this.skillHistoryArray.findIndex(x => x.skillId == event.id);
          if (skillHistoryUpdate instanceof SkillHistoryCreateRequest) {
            this.skillHistoryArray[foundIndex] = skillHistoryUpdate;
          }
        }
      }
    })
  }

  public removeSkillHistory(event: SkillResponse) {
    let dialogRef = this.dialog.open(WarningDialogComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.skillHistoryArray = this.skillHistoryArray.filter(skillHistory => skillHistory.skillId != event.id);
        this.selection.deselect(event.id);
      }
    });

  }


}
