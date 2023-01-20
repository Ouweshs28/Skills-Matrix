import {Injectable} from '@angular/core';
import {environment} from "../../../../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {
  EmployeeCreateOrUpdateRequest,
  EmployeeDomainCreateOrUpdateRequest,
  EmployeeDomainResponse,
  SkillCategoryCreateOrUpdateRequest,
  SkillCategoryResponse,
  SkillCreateOrUpdateRequest,
  SkillResponse
} from "../../../model/model";
import {Observable} from "rxjs";

const adminUrlApi = `${environment.apiUrl}/admin`

const header = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

@Injectable({
  providedIn: 'root'
})
export class AdminApiService {

  constructor(private http: HttpClient) {
  }

  //EMPLOYEE
  public createEmployee(employeeCreateOrUpdateRequest: EmployeeCreateOrUpdateRequest): Observable<EmployeeCreateOrUpdateRequest> {
    const url = `${adminUrlApi}/employees`;
    return this.http.post<EmployeeCreateOrUpdateRequest>(url, employeeCreateOrUpdateRequest, header);
  }

  //SKILLS
  public findSkillById(skillId: number): Observable<SkillResponse> {
    const url = `${adminUrlApi}/${skillId}`;
    return this.http.get<SkillResponse>(url);
  }

  public findEmployeeDomainById(domainId: number): Observable<EmployeeDomainResponse> {
    const url = `${adminUrlApi}/domains/${domainId}`;
    return this.http.get<EmployeeDomainResponse>(url);
  }

  public findSkillCategoryById(categoryId: number): Observable<SkillCategoryResponse> {
    const url = `${adminUrlApi}/categories/${categoryId}`;
    return this.http.get<SkillCategoryResponse>(url);
  }

  public createSkill(skillCreateOrUpdateRequest: SkillCreateOrUpdateRequest): Observable<SkillCreateOrUpdateRequest> {
    const url = `${adminUrlApi}/skills`;
    return this.http.post<SkillCreateOrUpdateRequest>(url, skillCreateOrUpdateRequest, header);
  }

  public createEmployeeDomain(employeeDomain: EmployeeDomainCreateOrUpdateRequest): Observable<EmployeeDomainCreateOrUpdateRequest> {
    const url = `${adminUrlApi}/domains`;
    return this.http.post<EmployeeDomainCreateOrUpdateRequest>(url, employeeDomain, header);
  }

  public createSkillCategory(skillCategory: SkillCategoryCreateOrUpdateRequest): Observable<SkillCategoryCreateOrUpdateRequest> {
    const url = `${adminUrlApi}/categories`;
    return this.http.post<SkillCategoryCreateOrUpdateRequest>(url, skillCategory, header);
  }

  public updateSkill(skill: SkillCreateOrUpdateRequest, skillId: number): Observable<SkillCreateOrUpdateRequest> {
    const url = `${adminUrlApi}/${skillId}`;
    return this.http.put<SkillCreateOrUpdateRequest>(url, skill, header);
  }

  public updateEmployeeDomain(domain: EmployeeDomainCreateOrUpdateRequest, domainId: number): Observable<EmployeeDomainCreateOrUpdateRequest> {
    const url = `${adminUrlApi}/domains/${domainId}`;
    return this.http.put<SkillCreateOrUpdateRequest>(url, domain, header);
  }

  public updateSkillCategory(skillCategory: SkillCategoryCreateOrUpdateRequest, categoryId: number): Observable<SkillCategoryCreateOrUpdateRequest> {
    const url = `${adminUrlApi}/categories/${categoryId}`;
    return this.http.put<SkillCategoryCreateOrUpdateRequest>(url, skillCategory, header);
  }

  public archiveSkill(skillId: number): Observable<SkillCreateOrUpdateRequest> {
    const url = `${adminUrlApi}/archive/${skillId}`;
    return this.http.put<SkillCreateOrUpdateRequest>(url, header);
  }

  public archiveEmployeeDomain(domainId: number): Observable<EmployeeDomainCreateOrUpdateRequest> {
    const url = `${adminUrlApi}/domains/archive/${domainId}`;
    return this.http.put<EmployeeDomainCreateOrUpdateRequest>(url, header);
  }

  public archiveSkillCategory(categoryId: number): Observable<SkillCategoryCreateOrUpdateRequest> {
    const url = `${adminUrlApi}/categories/archive/${categoryId}`;
    return this.http.put<SkillCategoryCreateOrUpdateRequest>(url, header);
  }
}
