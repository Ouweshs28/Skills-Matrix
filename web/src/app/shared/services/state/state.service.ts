import {Injectable} from '@angular/core';
import {EmployeeResponse, SkillHistoryResponse} from "../../model/model";
import {EmployeeApiService} from "../api/employee/employee-api.service";

@Injectable({
  providedIn: 'root'
})
export class StateService {
  loggedInUser: EmployeeResponse;
  public skillHistoryResponse: SkillHistoryResponse;
  public hasSelectedReview: boolean;
  public selectedEmployee: EmployeeResponse;

  constructor(private employeeServiceApi: EmployeeApiService) {
  }

  public setData(): void {

  }
}
