import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from "rxjs";
import {environment} from "../../../../../environments/environment";
import {Params} from "@angular/router";
import {
  EmployeeCreateOrUpdateRequest,
  EmployeeResponse,
  EmployeeSkillResponse,
  ManagerResponse,
  Page,
  SkillHistoryCreateRequest,
  SkillHistoryResponse,
  SkillHistoryUpdateRequest,
  SkillObjectiveResponse
} from "../../../model/model";

const employeeUrlApi = `${environment.apiUrl}/employees/me`

const header = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

@Injectable({
  providedIn: 'root'
})
export class EmployeeApiService {

  constructor(private http: HttpClient) {
  }

  public getLoggedInUser(): Observable<EmployeeResponse> {
    const url = `${employeeUrlApi}/`;
    return this.http.get<EmployeeResponse>(url);
  }

  public searchManagers(param: Params): Observable<Page<ManagerResponse[]>> {
    param.sortBy = 'firstName';
    const url = `${employeeUrlApi}/managers`;
    return this.http.get<Page<ManagerResponse[]>>(url, {params: param});
  }

  public searchObjectives(param: Params): Observable<Page<SkillObjectiveResponse[]>> {
    const url = `${employeeUrlApi}/objectives`;
    return this.http.get<Page<SkillObjectiveResponse[]>>(url, {params: param});
  }

  public findEmployeeSkills(param: Params): Observable<Page<EmployeeSkillResponse[]>> {
    const url = `${employeeUrlApi}/skills`;
    return this.http.get<Page<EmployeeSkillResponse[]>>(url, {params: param});
  }

  public updateProfile(employeeCreateOrUpdateRequest: EmployeeCreateOrUpdateRequest): Observable<EmployeeCreateOrUpdateRequest> {
    const url = `${employeeUrlApi}`;
    return this.http.put<EmployeeCreateOrUpdateRequest>(url, employeeCreateOrUpdateRequest, header);
  }

  public searchSkillHistory(param: Params): Observable<Page<SkillHistoryResponse[]>> {
    const url = `${employeeUrlApi}/history`;
    return this.http.get<Page<SkillHistoryResponse[]>>(url, {params: param});
  }

  public findSkillHistoryBySkillId(skillId: number, param: Params): Observable<Page<SkillHistoryResponse[]>> {
    const url = `${employeeUrlApi}/skills/${skillId}/history`;
    return this.http.get<Page<SkillHistoryResponse[]>>(url, {params: param});
  }

  public createSkillHistory(skillHistory: SkillHistoryCreateRequest): Observable<SkillHistoryCreateRequest> {
    const url = `${employeeUrlApi}/history`;
    return this.http.post<SkillHistoryCreateRequest>(url, skillHistory, header);
  }

  public updateSkillHistory(skillHistoryId: number, skillHistory: SkillHistoryUpdateRequest): Observable<SkillHistoryUpdateRequest> {
    const url = `${employeeUrlApi}/history/${skillHistoryId}`;
    return this.http.put<SkillHistoryUpdateRequest>(url, skillHistory, header);
  }

  public deleteSkillHistory(skillHistoryId: number): Observable<any> {
    const url = `${employeeUrlApi}/history/${skillHistoryId}`;
    return this.http.delete<any>(url);
  }

  public findEmployeeToReview(param: Params): Observable<Page<EmployeeResponse[]>> {
    const url = `${employeeUrlApi}/review`;
    return this.http.get<Page<EmployeeResponse[]>>(url, {params: param});
  }

}
