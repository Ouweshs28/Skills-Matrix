import {AfterContentInit, Component, NgZone} from '@angular/core';
import {EmployeeApiService} from "./shared/services/api/employee/employee-api.service";
import {StateService} from "./shared/services/state/state.service";
import {KeycloakService} from "keycloak-angular";
import {Router} from "@angular/router";
import {EmploymentPosition} from "./shared/model/model";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterContentInit {
  title = 'skillMatrixFE';
  user = {
    name: "",
    role: "",
    position: ""
  };

  temp: any;
  public isUserLoggedIn!: boolean;

  employmentPosition = EmploymentPosition;
  constructor(private employeeServiceApi: EmployeeApiService,
              private router: Router,
              private ngZone: NgZone,
              private stateService: StateService,
              private readonly _keycloakService: KeycloakService) {
    this._keycloakService.isLoggedIn().then(
      (isLoggedIn: boolean) => this.isUserLoggedIn = isLoggedIn)
    {
    }
  }

  ngAfterContentInit() {
    this.employeeServiceApi.getLoggedInUser().subscribe(
      result => {
        this.temp = result;
      },
      error => {
        console.log("Error");
      },
      () => {
        this.ngZone.run(() => {
          this.stateService.loggedInUser = this.temp;
          this.user.position = this.temp.position
        });
      })
    if (this._keycloakService.getKeycloakInstance().profile) {
      this.user.name = this._keycloakService.getKeycloakInstance().profile!.firstName + " " + this._keycloakService.getKeycloakInstance().profile!.lastName
      if (this._keycloakService.getKeycloakInstance().resourceAccess!['client-skills-matrix']['roles'].includes("ADMINISTRATOR")) {
        this.user.role = "ADMINISTRATOR"
      } else if (this._keycloakService.getKeycloakInstance().resourceAccess!['client-skills-matrix']['roles'].includes("MANAGER")) {
        this.user.role = "MANGER"
      } else {
        this.user.role = "EMPLOYEE"
      }
    }

  }

  public isLoggedIn(): boolean {
    return this.isUserLoggedIn;
  }

  public logUserOut(): void {
    this._keycloakService.logout();

  }

}
