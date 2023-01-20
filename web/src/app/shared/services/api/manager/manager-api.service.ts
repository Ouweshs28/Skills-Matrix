import {Injectable} from '@angular/core';
import {environment} from "../../../../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Params} from "@angular/router";
import {Observable} from "rxjs";
import {
  EmployeeResponse,
  EmployeeSkillResponse,
  Page,
  SkillHistoryResponse,
  SkillObjectiveCreateRequest,
  SkillObjectiveResponse,
  SkillObjectiveUpdateRequest,
  SkillStatus
} from "../../../model/model";

const managerUrlApi = `${environment.apiUrl}/employees`

const header = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

@Injectable({
  providedIn: 'root'
})
export class ManagerApiService {

  constructor(private http: HttpClient) {
  }

  public searchEmployees(param: Params): Observable<Page<EmployeeResponse[]>> {
    const url = `${managerUrlApi}/search`;
    return this.http.get<Page<EmployeeResponse[]>>(url, {params: param});
  }

  public searchManagersEmployees(managerId: number, param: Params): Observable<Page<EmployeeResponse[]>> {
    param.sortBy = 'firstName';
    const url = `${managerUrlApi}/all`;
    return this.http.get<Page<EmployeeResponse[]>>(url, {params: param});
  }

  public searchObjectives(id: number, param: Params): Observable<Page<SkillObjectiveResponse[]>> {
    const url = `${managerUrlApi}/${id}/objectives`;
    return this.http.get<Page<SkillObjectiveResponse[]>>(url, {params: param});
  }

  public searchAllObjectives(param: Params): Observable<Page<SkillObjectiveResponse[]>> {
    const url = `${managerUrlApi}/all/objectives`;
    return this.http.get<Page<SkillObjectiveResponse[]>>(url, {params: param});
  }

  public findEmployeeSkills(id: number, param: Params): Observable<Page<EmployeeSkillResponse[]>> {
    const url = `${managerUrlApi}/${id}/skills`;
    return this.http.get<Page<EmployeeSkillResponse[]>>(url, {params: param});
  }

  public findEmployeeById(employeeId: number): Observable<EmployeeResponse> {
    const url = `${managerUrlApi}/${employeeId}`;
    return this.http.get<EmployeeResponse>(url);
  }

  public createSkillObjective(employeeId: number, skillObjectiveCreateRequest: SkillObjectiveCreateRequest): Observable<SkillObjectiveCreateRequest> {
    const url = `${managerUrlApi}/${employeeId}/objectives`;
    return this.http.post<SkillObjectiveCreateRequest>(url, skillObjectiveCreateRequest, header);
  }

  public updateSkillObjective(employeeId: number, skillObjectiveId: number,
                              skillObjectiveUpdateRequest: SkillObjectiveUpdateRequest): Observable<SkillObjectiveUpdateRequest> {
    const url = `${managerUrlApi}/${employeeId}/objectives/${skillObjectiveId}`;
    return this.http.put<SkillObjectiveUpdateRequest>(url, skillObjectiveUpdateRequest, header);
  }

  public searchEmployeeSkillHistory(employeeId: number, skillHistoryStatus: SkillStatus, param: Params): Observable<Page<SkillHistoryResponse[]>> {
    const url = `${managerUrlApi}/${employeeId}/history/${skillHistoryStatus}`;
    return this.http.get<Page<SkillHistoryResponse[]>>(url, {params: param});
  }

  public findAssignedReviewersByEmployeeId(employeeId: number): Observable<Page<EmployeeResponse[]>> {
    const url = `${managerUrlApi}/${employeeId}/reviewers`;
    return this.http.get<Page<EmployeeResponse[]>>(url);
  }

  public updateSkillHistory(employeeId: number, skillHistoryId: number, param: Params) {
    const url = `${managerUrlApi}/${employeeId}/history/${skillHistoryId}`;
    return this.http.put<void>(url, param, header);
  }

  public assignReviewer(employeeId: number, reviewers: Number[]) {
    const url = `${managerUrlApi}/${employeeId}/history/reviewers`;
    return this.http.post<void>(url, reviewers);
  }

  public findEmployeeSkillHistoryByReviewerId(employeeId: number, reviewerId: number, param: Params): Observable<Page<SkillHistoryResponse[]>> {
    const url = `${managerUrlApi}/${employeeId}/reviewer/${reviewerId}/review`;
    return this.http.get<Page<SkillHistoryResponse[]>>(url, {params: param});
  }

  public findSkillObjectiveById(employeeId: number, skillObjectiveId: number): Observable<SkillObjectiveResponse> {
    const url = `${managerUrlApi}/${employeeId}/objectives/${skillObjectiveId}`;
    return this.http.get<SkillObjectiveResponse>(url, {});
  }

  public findSkillHistoryByEmployeeId(employeeId: number, param: Params): Observable<Page<SkillHistoryResponse[]>> {
    const url = `${managerUrlApi}/review/${employeeId}`;
    return this.http.get<Page<SkillHistoryResponse[]>>(url, {params: param});
  }

}
