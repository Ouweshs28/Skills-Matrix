import {APP_INITIALIZER, NgModule, Provider} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {DashboardComponent} from './shared/dashboard/dashboard.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatLegacyMenuModule as MatMenuModule} from '@angular/material/legacy-menu';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatLegacyListModule as MatListModule} from '@angular/material/legacy-list';
import {MatLegacyButtonModule as MatButtonModule} from '@angular/material/legacy-button';
import {PageNotFoundComponent} from './shared/page-not-found/page-not-found.component';
import {SearchEmployeeSkillsComponent} from './features/search-employee-skills/search-employee-skills.component';
import {MatLegacyFormFieldModule as MatFormFieldModule} from "@angular/material/legacy-form-field";
import {MatLegacyInputModule as MatInputModule} from "@angular/material/legacy-input";
import {MatLegacySelectModule as MatSelectModule} from "@angular/material/legacy-select";
import {MatNativeDateModule} from "@angular/material/core";
import {MatLegacyOptionModule as MatOptionModule} from "@angular/material/legacy-core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatLegacyTableModule as MatTableModule} from "@angular/material/legacy-table";
import {MatSortModule} from "@angular/material/sort";
import {MatLegacyPaginatorModule as MatPaginatorModule} from "@angular/material/legacy-paginator";
import {MyEmployeeObjectivesComponent} from './features/my-employee-objectives/my-employee-objectives.component';
import {CreateUpdateCategoryComponent} from './features/create-update-category/create-update-category.component';
import {CreateUpdateDomainComponent} from './features/create-update-domain/create-update-domain.component';
import {CreateUpdateSkillComponent} from './features/create-update-skill/create-update-skill.component';
import {ListSearchCategoryComponent} from './features/list-search-category/list-search-category.component';
import {ListSearchDomainComponent} from './features/list-search-domain/list-search-domain.component';
import {ListSearchSkillComponent} from './features/list-search-skill/list-search-skill.component';
import {WarningDialogComponent} from './shared/warning-dialog/warning-dialog.component';
import {ToastrModule} from 'ngx-toastr';
import {MatLegacyCardModule as MatCardModule} from '@angular/material/legacy-card';
import {MatLegacyDialogModule as MatDialogModule} from '@angular/material/legacy-dialog';
import {EmployeeAssessmentComponent} from './features/employee-assessment/employee-assessment.component';
import {MatLegacyTooltipModule as MatTooltipModule} from '@angular/material/legacy-tooltip';
import {MatLegacyCheckboxModule as MatCheckboxModule} from '@angular/material/legacy-checkbox';
import {
  UpdateSkillAssessmentRecordComponent
} from './features/update-skill-assessment-record/update-skill-assessment-record.component';
import {MatExpansionModule} from '@angular/material/expansion';
import {CreateUpdateEmployeeComponent} from './features/create-update-employee/create-update-employee.component';
import {MatLegacyTabsModule as MatTabsModule} from "@angular/material/legacy-tabs";
import {MatLegacySnackBarModule as MatSnackBarModule} from '@angular/material/legacy-snack-bar';
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

