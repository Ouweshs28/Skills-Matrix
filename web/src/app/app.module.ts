import {APP_INITIALIZER, NgModule, Provider} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {DashboardComponent} from './shared/dashboard/dashboard.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatMenuModule} from '@angular/material/menu';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatListModule} from '@angular/material/list';
import {MatButtonModule} from '@angular/material/button';
import {PageNotFoundComponent} from './shared/page-not-found/page-not-found.component';
import {SearchEmployeeSkillsComponent} from './features/search-employee-skills/search-employee-skills.component';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {MatNativeDateModule, MatOptionModule} from "@angular/material/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatTableModule} from "@angular/material/table";
import {MatSortModule} from "@angular/material/sort";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MyEmployeeObjectivesComponent} from './features/my-employee-objectives/my-employee-objectives.component';
import {CreateUpdateCategoryComponent} from './features/create-update-category/create-update-category.component';
import {CreateUpdateDomainComponent} from './features/create-update-domain/create-update-domain.component';
import {CreateUpdateSkillComponent} from './features/create-update-skill/create-update-skill.component';
import {ListSearchCategoryComponent} from './features/list-search-category/list-search-category.component';
import {ListSearchDomainComponent} from './features/list-search-domain/list-search-domain.component';
import {ListSearchSkillComponent} from './features/list-search-skill/list-search-skill.component';
import {WarningDialogComponent} from './shared/warning-dialog/warning-dialog.component';
import {ToastrModule} from 'ngx-toastr';
import {MatCardModule} from '@angular/material/card';
import {MatDialogModule} from '@angular/material/dialog';
import {EmployeeAssessmentComponent} from './features/employee-assessment/employee-assessment.component';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {
  UpdateSkillAssessmentRecordComponent
} from './features/update-skill-assessment-record/update-skill-assessment-record.component';
import {MatExpansionModule} from '@angular/material/expansion';
import {CreateUpdateEmployeeComponent} from './features/create-update-employee/create-update-employee.component';
import {MatTabsModule} from "@angular/material/tabs";
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {
  ManagerEmployeeAssessmentsComponent
} from './features/manager-employee-assessments/manager-employee-assessments.component';
import {MyEmployeeSkillsComponent} from './features/my-employee-skills/my-employee-skills.component';
import {EmployeeHistoryDialogComponent} from './shared/employee-history-dialog/employee-history-dialog.component';
import {
  DeclinedCommentsDialogComponent
} from './features/manager-employee-assessments/declined-comments-dialog/declined-comments-dialog.component';
import {
  EmployeeSearchFilterDialogComponent
} from './shared/employee-search-filter-dialog/employee-search-filter-dialog.component';
import {
  EmployeeSearchAddSkillLevelDialogComponent
} from './shared/employee-search-add-skill-level-dialog/employee-search-add-skill-level-dialog.component';
import {ReviewerAssessmentComponent} from './features/reviewer-assessment/reviewer-assessment.component';
import {TrackingProgressComponent} from './features/tracking-progress/tracking-progress.component';
import {NgChartsModule} from 'ng2-charts';
import {SetTargetDateComponent} from './features/my-employee-skills/set-target-date/set-target-date.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {
  ManagerViewEmployeeObjectivesComponent
} from './features/manager-view-employee-objectives/manager-view-employee-objectives.component';
import {
  EmployeeAssessmentAddSkillTabularFormComponent
} from './features/employee-assessment-add-skill-tabular-form/employee-assessment-add-skill-tabular-form.component';
import {
  SkillHistoryAddTableFormComponent
} from './features/employee-assessment-add-skill-tabular-form/skill-history-add-table-form/skill-history-add-table-form.component';
import {DocumentsDialogComponent} from './shared/documents-dialog/documents-dialog.component';
import {
  EmployeeAssesmentAddSkillComponent
} from './features/employee-assesment-add-skill/employee-assesment-add-skill.component';
import {
  AddSkillLevelDialogComponent
} from './features/employee-assesment-add-skill/add-skill-level-dialog/add-skill-level-dialog.component';
import {KeycloakAngularModule, KeycloakService} from "keycloak-angular";
import {AppConfigService} from "./shared/config/app-config.service";

export const AppConfigurationFactory = (
  appConfig: AppConfigService) => () => appConfig.loadAppConfig();
export const initializeKeycloak = (keycloak: KeycloakService) => {
  return () =>
    keycloak.init({
      config: {
        url: 'http://localhost:9005/auth',
        realm: 'skills-matrix',
        clientId: 'client-skills-matrix'
      },
      initOptions: {
        checkLoginIframe: false,
        checkLoginIframeInterval: 25 //seconds

      },
      loadUserProfileAtStartUp: true
      ,
    });
};

const appConfigProvider: Provider = {
  provide: APP_INITIALIZER,
  useFactory: AppConfigurationFactory,
  multi: true,
  deps: [AppConfigService, HttpClient]
};

const keycloakProvider: Provider = {
  provide: APP_INITIALIZER,
  useFactory: initializeKeycloak,
  multi: true,
  deps: [KeycloakService]
}

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    PageNotFoundComponent,
    SearchEmployeeSkillsComponent,
    MyEmployeeObjectivesComponent,
    CreateUpdateEmployeeComponent,
    CreateUpdateCategoryComponent,
    CreateUpdateDomainComponent,
    CreateUpdateSkillComponent,
    ListSearchCategoryComponent,
    ListSearchDomainComponent,
    ListSearchSkillComponent,
    WarningDialogComponent,
    EmployeeAssessmentComponent,
    UpdateSkillAssessmentRecordComponent,
    CreateUpdateEmployeeComponent,
    ManagerEmployeeAssessmentsComponent,
    MyEmployeeSkillsComponent,
    EmployeeHistoryDialogComponent,
    DeclinedCommentsDialogComponent,
    EmployeeSearchFilterDialogComponent,
    EmployeeSearchAddSkillLevelDialogComponent,
    ReviewerAssessmentComponent,
    TrackingProgressComponent,
    SetTargetDateComponent,
    SetTargetDateComponent,
    ManagerViewEmployeeObjectivesComponent,
    EmployeeAssessmentAddSkillTabularFormComponent,
    SkillHistoryAddTableFormComponent,
    DocumentsDialogComponent,
    EmployeeAssesmentAddSkillComponent,
    AddSkillLevelDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    MatToolbarModule,
    MatMenuModule,
    MatIconModule,
    MatDividerModule,
    MatListModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatTableModule,
    MatSortModule,
    FormsModule,
    MatPaginatorModule,
    MatCardModule,
    ToastrModule.forRoot(),
    MatCardModule,
    MatDialogModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatTabsModule,
    MatExpansionModule,
    MatSnackBarModule,
    MatSnackBarModule,
    NgChartsModule,
    MatToolbarModule,
    MatDatepickerModule,
    MatNativeDateModule,
    KeycloakAngularModule,
  ],
  providers: [
    AppConfigService,
    appConfigProvider,
    keycloakProvider,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

}

