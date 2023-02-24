import {Component, OnInit, ViewChild} from '@angular/core';
import {SkillResponse} from 'src/app/shared/model/model';
import {SkillApiService} from '../../shared/services/api/skill/skill-api.service';
import {WarningDialogComponent} from 'src/app/shared/warning-dialog/warning-dialog.component';
import {MatLegacyTableDataSource as MatTableDataSource} from '@angular/material/legacy-table';
import {LegacyPageEvent as PageEvent} from '@angular/material/legacy-paginator';
import {MatSort} from '@angular/material/sort';
import {Workbook} from 'exceljs';
import * as fs from 'file-saver';
import {MatLegacyDialog as MatDialog} from '@angular/material/legacy-dialog';
import {AdminApiService} from "../../shared/services/api/admin/admin-api.service";

@Component({
  selector: 'app-list-search-skill',
  templateUrl: './list-search-skill.component.html',
  styleUrls: ['./list-search-skill.component.scss'],
})
export class ListSearchSkillComponent implements OnInit {
  @ViewChild(MatSort) sort!: MatSort;
  public searchCriteria!: string;
  public displayedColumns: string[] = [
    'name',
    'description',
    'levelRequirements',
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

  constructor(
    private skillApiService: SkillApiService,
    private adminServiceApi: AdminApiService,
    private dialog: MatDialog
  ) {
  }

  ngOnInit(): void {
    this.getAllSkills();
  }

  public onKeyupEvent(event: any) {
    this.generateTableItemsBasedOnSearchCriteria(event);
  }

  public exportToExcel() {
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('SkillSheet');
    worksheet.columns = [
      {header: 'Skill Name', key: 'name', width: 60},
      {header: 'Skill Description', key: 'description', width: 60},
      {header: 'Level Requirement', key: 'requirement', width: 60},
      {header: 'Skill Category', key: 'category', width: 60},
      {header: 'Skill Domain', key: 'domain', width: 60},
    ];
    this.skillArray.forEach((skill) => {
      worksheet.addRow(
        {
          name: skill.name,
          description: skill.description,
          requirement: skill.levelRequirements,
          category: skill.skillCategory.name,
          domain: skill.employeeDomain.name,
        },
        'n'
      );
    });
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      fs.saveAs(blob, 'Skill.xlsx');
    });
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

  public deleteConfirmation(skillId: number): void {
    let dialogRef = this.dialog.open(WarningDialogComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteSkill(skillId);
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
    this.skillApiService.searchSkills(this.defaultParam).subscribe((skill) => {
      this.skillArray = skill.content;
      this.dataSource = new MatTableDataSource(this.skillArray);

    });
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

  private deleteSkill(skillId: number) {
    this.adminServiceApi.archiveSkill(skillId).subscribe(() => {
      this.skillArray = this.skillArray.filter((skill) => skill.id !== skillId);
      this.dataSource = new MatTableDataSource(this.skillArray);
      this.dataSource.sort = this.sort;
      this.totalElements = this.skillArray.length;
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
}
