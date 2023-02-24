import {Component, OnInit, ViewChild} from '@angular/core';
import {EmployeeDomainResponse} from 'src/app/shared/model/model';
import {SkillApiService} from '../../shared/services/api/skill/skill-api.service';
import {MatLegacyTableDataSource as MatTableDataSource} from '@angular/material/legacy-table';
import {LegacyPageEvent as PageEvent} from '@angular/material/legacy-paginator';
import {MatSort} from '@angular/material/sort';
import {Workbook} from 'exceljs';
import * as fs from 'file-saver';
import {MatLegacyDialog as MatDialog} from '@angular/material/legacy-dialog';
import {WarningDialogComponent} from 'src/app/shared/warning-dialog/warning-dialog.component';
import {AdminApiService} from "../../shared/services/api/admin/admin-api.service";

@Component({
  selector: 'app-list-search-domain',
  templateUrl: './list-search-domain.component.html',
  styleUrls: ['./list-search-domain.component.scss'],
})
export class ListSearchDomainComponent implements OnInit {
  @ViewChild(MatSort) sort!: MatSort;
  public searchCriteria!: string;
  public displayedColumns: string[] = ['name', 'description', 'actions'];
  public dataSource!: any;
  public domainArray: EmployeeDomainResponse[] = [];
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
    public dialog: MatDialog
  ) {
  }

  ngOnInit(): void {
    this.getAllDomains();
  }

  public onKeyUpEvent(event: any) {
    this.generateTableItemsBasedOnSearchCriteria(event);
  }

  public exportToExcel() {
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('EmployeeDomainSheet');
    worksheet.columns = [
      {header: 'Domain Name', key: 'name', width: 20},
      {header: 'Domain Description', key: 'description', width: 160},
    ];
    this.domainArray.forEach((e) => {
      worksheet.addRow({name: e.name, description: e.description}, 'n');
    });
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      fs.saveAs(blob, 'EmployeeDomain.xlsx');
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
      this.skillApiService.searchEmployeeDomains(param).subscribe(
        (domains) => {
          this.domainArray = domains.content;
          this.dataSource = new MatTableDataSource(this.domainArray);
        },
        (error) => console.log(error)
      );
    } else {
      let param = {
        sortOrder: event.direction,
        sortBy: event.active,
        pageNumber: this.pageIndex,
        pageSize: this.pageSize,
        employeeDomainSearchCriteria: this.searchCriteria,
      };
      this.skillApiService.searchEmployeeDomains(param).subscribe((domains) => {
        this.domainArray = domains.content;
        this.dataSource = new MatTableDataSource(this.domainArray);
      });
    }
  }

  public deleteConfirmation(domainId: number): void {
    let dialogRef = this.dialog.open(WarningDialogComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteDomain(domainId);
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
    this.skillApiService.searchEmployeeDomains(this.defaultParam).subscribe(
      (domain) => {
        this.domainArray = domain.content;
        this.dataSource = new MatTableDataSource(this.domainArray);
      }
    );
  }

  public getAllDomains(): void {
    this.defaultParam.sortBy = 'name';
    this.skillApiService.searchEmployeeDomains(this.defaultParam).subscribe(
      (domain) => {
        this.domainArray = domain.content;
        this.dataSource = new MatTableDataSource(this.domainArray);
        this.totalElements = domain.totalElements;
        this.dataSource.sort = this.sort;
      }
    );
  }

  private deleteDomain(domainId: number) {
    this.adminServiceApi.archiveEmployeeDomain(domainId).subscribe(() => {
      this.domainArray = this.domainArray.filter(
        (domain) => domain.id !== domainId
      );
      this.dataSource = new MatTableDataSource(this.domainArray);
      this.dataSource.sort = this.sort;
      this.totalElements = this.domainArray.length;
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
    this.skillApiService.searchEmployeeDomains(param).subscribe((domains) => {
      this.domainArray = domains.content;
      this.dataSource = new MatTableDataSource(this.domainArray);
    });
  }
}
