import {AfterContentInit, Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {
  EmployeeCreateOrUpdateRequest,
  EmployeeDomainResponse,
  EmploymentPosition,
  Factory,
  Gender,
  ManagerResponse
} from "../../shared/model/model";
import {ToastrService} from "ngx-toastr";
import {Params, Router} from "@angular/router";
import {SkillApiService} from "../../shared/services/api/skill/skill-api.service";
import {EmployeeApiService} from "../../shared/services/api/employee/employee-api.service";
import {AdminApiService} from "../../shared/services/api/admin/admin-api.service";
import {StateService} from "../../shared/services/state/state.service";

@Component({
  selector: 'app-create-update-employee',
  templateUrl: './create-update-employee.component.html',
  styleUrls: ['./create-update-employee.component.scss']
})
export class CreateUpdateEmployeeComponent implements AfterContentInit {

  public employeeAdditionForm: FormGroup;
  public genderList: string[] = Object.values(Gender).map(k => Gender[k]);
  public employeeDomainList: EmployeeDomainResponse[] = [];
  public managerList: ManagerResponse[] = [];
  public factoryList: string[] = Factory.keys();
  // @ts-ignore
  public positionList: EmploymentPosition[] = EmploymentPosition.values();
  public employee!: any;
  public domains = new FormControl();
  public title!: String;
  public buttonName!: String;
  public employeeId!: number;
  public isUpdate!: Boolean;
  public currentUserSessionId!: number;
  public noManager = {
    id: 0,
    firstName: 'NOT',
    lastName: 'ASSIGNED'
  }

  private defaultParam = {
    sortOrder: 'ASC',
    sortBy: 'name',
    pageNumber: 0,
    pageSize: 10,
    employeeName: ''

  };

  public searchManagersCrtieria: string = "";

  constructor(private employeeServiceApi: EmployeeApiService,
              private skillServiceApi: SkillApiService,
              private adminServiceApi: AdminApiService,
              private toastr: ToastrService,
              private router: Router,
              private stateService: StateService) {
  }

  ngAfterContentInit(): void {
    this.getUserSessionDetails()
    this.checkRouterLink();
    this.initForm();
    this.getEmployeeDomain(this.defaultParam);
    this.getManagers(this.searchManagersCrtieria);
    this.initialiseEmployee();
  }

  private initialiseEmployee(): void {

    if (this.isUpdate) {
      this.employeeServiceApi.getLoggedInUser().subscribe(
        data => {
          // @ts-ignore
          this.employee.firstName = data.firstName;
          // @ts-ignore
          this.employee.lastName = data.lastName;
          // @ts-ignore
          this.employee.position = data.position;
          // @ts-ignore
          this.employee.gender = data.gender;
          if (data.employeeDomain.id != null) {
            // @ts-ignore
            this.employee.employeeDomainId = data.employeeDomain.id;
          }
          // @ts-ignore
          this.employee.factory = data.factory
          // @ts-ignore
          this.employee.email = data.email;
          // @ts-ignore
          if (data.manager.id == null) {
            this.employee.managerId = 0;
          } else {
            // @ts-ignore
            this.employee.managerId = data.manager.id
          }
          console.log(this.employee)
        }
      )

    }
    this.employee = {
      firstName: "",
      lastName: "",
      gender: "",
      email: "",
      factory: "",
      position: "",
      managerId: 0,
      visa: "",
    }
  }

  private registerEmployee(): void {
    if (this.employee.managerId === 0) {
      this.employee.managerId = null;
    }
    this.employee.employeeDomainId = null;
    this.adminServiceApi.createEmployee(this.employee).subscribe((employee) => {
      this.toastr.success("Employee " + this.employee.firstName + " successfully registered!");
    })
    setTimeout(() => {
      this.router.navigate(['dashboard']);
    }, 2000);
  }

  public updateEmployee(employee: EmployeeCreateOrUpdateRequest): void {
    if (this.employee.managerId === 0) {
      this.employee.managerId = null;
    }
    this.employeeServiceApi.updateProfile(employee).subscribe(() => {
      this.toastr.success("Employee " + this.employee.firstName + " successfully!");
    });
    setTimeout(() => {
      this.router.navigate(['dashboard']);
    }, 2000);
  }

  public checkOperationType(): void {
    if (!this.isUpdate) {
      this.registerEmployee();
    } else {
      this.updateEmployee(this.employee);
    }
  }


  private checkRouterLink(): void {
    if (this.router.url.startsWith("/update-employee")) {
      this.title = "My Profile";
      this.buttonName = "Submit";
      this.isUpdate = true;
    } else if (this.router.url.startsWith("/register-employee")) {
      this.title = "Add Employee";
      this.buttonName = "Submit";
    } else {
      this.title = "My Profile";
      this.buttonName = "Submit";
    }
  }


  private initForm(): void {
    if (this.isUpdate) {
      this.employeeAdditionForm = new FormGroup({
        firstName: new FormControl(null, [Validators.required, Validators.pattern('[a-zA-Z ]*')]),
        lastName: new FormControl(null, [Validators.required, Validators.pattern('[a-zA-Z ]*')]),
        gender: new FormControl(null, Validators.required),
        email: new FormControl(null, [Validators.required, Validators.email]),
        factory: new FormControl(null, Validators.required),
        manager: new FormControl(null,),
        position: new FormControl(null, Validators.required),
        employeeDomainId: new FormControl(null),
      });
    } else {
      this.employeeAdditionForm = new FormGroup({
        firstName: new FormControl(null, [Validators.required, Validators.pattern('[a-zA-Z ]*')]),
        lastName: new FormControl(null, [Validators.required, Validators.pattern('[a-zA-Z ]*')]),
        gender: new FormControl(null, Validators.required),
        email: new FormControl(null, [Validators.required, Validators.email]),
        factory: new FormControl(null, Validators.required),
        manager: new FormControl(null,),
        position: new FormControl(null, Validators.required),
        visa: new FormControl(null, Validators.required),
      });

    }
  }

  private getEmployeeDomain(param: Params): void {
    this.skillServiceApi.searchEmployeeDomains(param).subscribe(
      (domains) => {
        this.employeeDomainList = domains.content;
      });
  }

  public getManagers(employeeName: string): void {
    this.defaultParam.employeeName = employeeName;
    this.employeeServiceApi.searchManagers(this.defaultParam).subscribe(
      (managers) => {
        this.managerList = [];
        this.managerList = managers.content;
        this.managerList.push(this.noManager)
      });
  }

  public onClose() {
    this.searchManagersCrtieria = "";
    this.getManagers(this.searchManagersCrtieria)
  }

  private getUserSessionDetails(): void {
    if (this.stateService.loggedInUser != undefined) {
      this.currentUserSessionId = this.stateService.loggedInUser.id
    }
  }

}
