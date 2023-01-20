import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {EmployeeDomainResponse, Page, SkillCategoryResponse, SkillResponse,} from "../../../model/model";
import {environment} from "../../../../../environments/environment";
import {Params} from "@angular/router";


const header = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

const skillsSearchUrlApi = `${environment.apiUrl}/skills`


@Injectable({
  providedIn: 'root'
})


export class SkillApiService {
  private sortParam = {
    sortOrder: 'ASC',
    sortBy: 'name',
    keyword: '',
    pageNumber: 0,
    pageSize: 10,
    employeeName: ''
  };

  public existingSkillId: number[] = [];


  constructor(private http: HttpClient) {
  }

  public searchSkills(param: Params): Observable<Page<SkillResponse[]>> {
    const url = `${skillsSearchUrlApi}/search`;
    return this.http.get<Page<SkillResponse[]>>(url, {params: param});
  }

  public searchEmployeeDomains(param: Params): Observable<Page<EmployeeDomainResponse[]>> {
    const url = `${skillsSearchUrlApi}/domains/search`;
    return this.http.get<Page<EmployeeDomainResponse[]>>(url, {params: param});
  }

  public searchSkillCategories(param: Params): Observable<Page<SkillCategoryResponse[]>> {
    const url = `${skillsSearchUrlApi}/categories/search`;
    return this.http.get<Page<SkillCategoryResponse[]>>(url, {params: param});
  }

}
