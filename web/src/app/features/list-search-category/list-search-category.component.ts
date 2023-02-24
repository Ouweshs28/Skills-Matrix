import {Component, OnInit, ViewChild} from '@angular/core';
import {SkillCategoryResponse} from 'src/app/shared/model/model';
import {SkillApiService} from '../../shared/services/api/skill/skill-api.service';
import {MatLegacyDialog as MatDialog} from '@angular/material/legacy-dialog';
import {WarningDialogComponent} from 'src/app/shared/warning-dialog/warning-dialog.component';
import {MatLegacyTableDataSource as MatTableDataSource} from '@angular/material/legacy-table';
import {LegacyPageEvent as PageEvent} from '@angular/material/legacy-paginator';
import {MatSort} from '@angular/material/sort';
import {Workbook} from 'exceljs';
import * as fs from 'file-saver';
import {AdminApiService} from "../../shared/services/api/admin/admin-api.service";

@Component({
  selector: 'app-list-search-category',
  templateUrl: './list-search-category.component.html',
  styleUrls: ['./list-search-category.component.scss'],
})
export class ListSearchCategoryComponent implements OnInit {
  @ViewChild(MatSort) sort!: MatSort;
  public searchCriteria!: string;
  public displayedColumns: string[] = ['name', 'description', 'actions'];
  public dataSource!: any;
  public categoryArray: SkillCategoryResponse[] = [];
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
    private adminApiService: AdminApiService,
    private dialog: MatDialog
  ) {
  }

  ngOnInit(): void {
    this.getAllCategories();
  }

  public onKeyUpEvent(event: any) {
    this.generateTableItemsBasedOnSearchCriteria(event);
  }

  public exportToExcel() {
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('SkillCategorySheet');
    worksheet.columns = [
      {header: 'Category Name', key: 'name', width: 20},
      {header: 'Category Description', key: 'description', width: 160},
    ];
    this.categoryArray.forEach((e) => {
      worksheet.addRow({name: e.name, description: e.description}, 'n');
    });
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      fs.saveAs(blob, 'SkillCategory.xlsx');
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
      this.skillApiService.searchSkillCategories(param).subscribe(
        (categories) => {
          this.categoryArray = categories.content;
          this.dataSource = new MatTableDataSource(this.categoryArray);
        },
        (error) => console.log(error)
      );
    } else {
      let param = {
        sortOrder: event.direction,
        sortBy: event.active,
        pageNumber: this.pageIndex,
        pageSize: this.pageSize,
        skillCategorySearchCriteria: this.searchCriteria,
      };
      this.skillApiService.searchSkillCategories(param).subscribe((categories) => {
        this.categoryArray = categories.content;
        this.dataSource = new MatTableDataSource(this.categoryArray);
      });
    }
  }

  public deleteConfirmation(categoryId: number): void {
    let dialogRef = this.dialog.open(WarningDialogComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteCategory(categoryId);
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
    this.skillApiService.searchSkillCategories(this.defaultParam).subscribe(
      (category) => {
        this.categoryArray = category.content;
        this.dataSource = new MatTableDataSource(this.categoryArray);
      }
    );
  }

  private getAllCategories(): void {
    this.defaultParam.sortBy = 'name';
    this.skillApiService.searchSkillCategories(this.defaultParam).subscribe(
      (category) => {
        this.categoryArray = category.content;
        this.dataSource = new MatTableDataSource(this.categoryArray);
        this.totalElements = category.totalElements;
        this.dataSource.sort = this.sort;
      }
    );
  }


  private deleteCategory(categoryId: number) {
    this.adminApiService.archiveSkillCategory(categoryId).subscribe(() => {
      this.categoryArray = this.categoryArray.filter(
        (category) => category.id !== categoryId
      );
      this.dataSource = new MatTableDataSource(this.categoryArray);
      this.dataSource.sort = this.sort;
      this.totalElements = this.categoryArray.length;
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
    this.skillApiService.searchSkillCategories(param).subscribe((categories) => {
      this.categoryArray = categories.content;
      this.dataSource = new MatTableDataSource(this.categoryArray);
    });
  }


}
