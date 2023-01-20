import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {EmployeeDomainResponse, Factory, SkillLevel} from "../model/model";
import {EmployeeApiService} from "../services/api/employee/employee-api.service";
import {SkillApiService} from "../services/api/skill/skill-api.service";
import {MatTable} from "@angular/material/table";
import {
  EmployeeSearchAddSkillLevelDialogComponent
} from "../employee-search-add-skill-level-dialog/employee-search-add-skill-level-dialog.component";

@Component({
  selector: 'app-employee-search-filter-dialog',
  templateUrl: './employee-search-filter-dialog.component.html',
  styleUrls: ['./employee-search-filter-dialog.component.scss']
})
export class EmployeeSearchFilterDialogComponent implements OnInit {
  factoryValue: string = "";
  skillLevel: string = "";
  domains: [];
  skills = []
  factoryList: string[] = Factory.keys();
  // @ts-ignore
  skillLevelList: string[] = SkillLevel.values().map(k => SkillLevel.valueOf(k).label);
  employeeDomainList: EmployeeDomainResponse[] = [];
  dataSource: any = [];
  displayedColumns: string[] = ['name', 'level', 'action'];
  SkillLevelEnum: any = SkillLevel;
  @ViewChild(MatTable, {static: true}) table: MatTable<any>;
  private defaultParam = {
    sortOrder: 'ASC',
    sortBy: 'name',
    pageNumber: 0,
    pageSize: 10,
    employeeName: ''
  };
  public hasData: boolean = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              public dialogRef: MatDialogRef<EmployeeSearchFilterDialogComponent>,
              private employeeServiceApi: EmployeeApiService,
              private skillServiceApi: SkillApiService,
              public dialog: MatDialog
  ) {
    console.log(data)
    dialogRef.disableClose = true;

  }


  ngOnInit(): void {
    this.getEmployeeDomain();

    if (this.data != undefined) {
      this.hasData = true;
      console.log(this.data)
      this.factoryValue = this.data.factoryValue;
      this.domains = this.data.domains;
      this.dataSource = this.data.skillLevel;

    }
  }

  public updateFilterBtn() {
    this.hasData = !!(this.factoryValue || this.domains);
  }

  public OnResetFilters() {
    this.factoryValue = '';
    this.skills = [];
    this.domains = [];
    this.dataSource = []
    this.hasData = false;
  }


  public getEmployeeDomain(): void {
    this.skillServiceApi.searchEmployeeDomains(this.defaultParam).subscribe(
      (domains) => {
        this.employeeDomainList = domains.content;
      });
  }


  public sendFilterData(): void {
    let varTab = new Array(this.dataSource)
    this.data = {
      factoryValue: this.factoryValue,
      domains: this.domains,
      skillLevel: varTab[0]
    }
    this.dialogRef.close(this.data)
  }

  openDialog(action: any, obj: any) {
    obj.action = action;
    const dialogRef = this.dialog.open(EmployeeSearchAddSkillLevelDialogComponent, {
      data: obj,
      width: '756px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result)
      if (result.event == 'Add') {
        if (result.data.id !== null
          && result.data.name !== ""
          && result.data.level !== "") {
          this.hasData = true;
          this.addRowData(result.data);
        }
      } else if (result.event == 'Update') {
        if (result.data.id !== null
          && result.data.name !== ""
          && result.data.level !== "") {
          this.hasData = true;
          this.updateRowData(result.data);
        }
      } else if (result.event == 'Delete') {
        console.log(result.data)
        this.deleteRowData(result.data);
      }
    });
  }

  addRowData(row_obj: any) {
    console.log(row_obj)
    this.dataSource.push({
      id: row_obj.id,
      name: row_obj.name,
      level: row_obj.level
    });
    this.table.renderRows();

  }

  updateRowData(row_obj: any) {
    console.log("data to update")
    console.log(row_obj);
    this.dataSource = this.dataSource.filter((value: any, key: any) => {
      console.log("data existing")
      console.log(value);
      if (value.id == row_obj.id) {
        value.id = row_obj.id
        value.name = row_obj.name;
        value.level = row_obj.level;
      }
      return true;
    });
  }

  deleteRowData(row_obj: any) {
    console.log(row_obj)
    this.dataSource = this.dataSource.filter((value: any, key: any) => {
      return value.id != row_obj.id;
    });
  }

  compareObjects(o1: any, o2: any): boolean {
    if (o1 == undefined || o2 == null) {
      return false
    }
    return o1.id === o2.id;
  }

}
