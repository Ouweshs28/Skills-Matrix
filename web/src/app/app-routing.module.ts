import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DashboardComponent} from './shared/dashboard/dashboard.component';
import {PageNotFoundComponent} from './shared/page-not-found/page-not-found.component';
import {SearchEmployeeSkillsComponent} from "./features/search-employee-skills/search-employee-skills.component";
import {MyEmployeeObjectivesComponent} from "./features/my-employee-objectives/my-employee-objectives.component";
import {CreateUpdateSkillComponent} from './features/create-update-skill/create-update-skill.component';
import {ListSearchSkillComponent} from './features/list-search-skill/list-search-skill.component';
import {CreateUpdateDomainComponent} from './features/create-update-domain/create-update-domain.component';
import {ListSearchDomainComponent} from './features/list-search-domain/list-search-domain.component';
import {CreateUpdateCategoryComponent} from './features/create-update-category/create-update-category.component';
import {ListSearchCategoryComponent} from './features/list-search-category/list-search-category.component';
import {EmployeeAssessmentComponent} from './features/employee-assessment/employee-assessment.component';
import {
  UpdateSkillAssessmentRecordComponent
} from './features/update-skill-assessment-record/update-skill-assessment-record.component';
import {CreateUpdateEmployeeComponent} from "./features/create-update-employee/create-update-employee.component";
import {
  ManagerEmployeeAssessmentsComponent
} from './features/manager-employee-assessments/manager-employee-assessments.component';
import {MyEmployeeSkillsComponent} from "./features/my-employee-skills/my-employee-skills.component";
import {ReviewerAssessmentComponent} from './features/reviewer-assessment/reviewer-assessment.component';
import {TrackingProgressComponent} from './features/tracking-progress/tracking-progress.component';
import {
  ManagerViewEmployeeObjectivesComponent
} from './features/manager-view-employee-objectives/manager-view-employee-objectives.component';
import {
  EmployeeAssesmentAddSkillComponent
} from "./features/employee-assesment-add-skill/employee-assesment-add-skill.component";
import {AppGuard} from "./shared/guard/app.guard";


const routes: Routes = [
  {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
  {path: 'dashboard', canActivate: [AppGuard], component: DashboardComponent},
  {
    path: 'searchEmployeeSkills',
    canActivate: [AppGuard],
    data: {roles: ['MANAGER', 'ADMINISTRATOR']},
    component: SearchEmployeeSkillsComponent
  },
  {path: 'page-not-found', component: PageNotFoundComponent},
  {
    path: 'create-skill', canActivate: [AppGuard], component: CreateUpdateSkillComponent,
    data: {roles: ['ADMINISTRATOR']},
  },
  {
    path: 'create-domain', canActivate: [AppGuard], component: CreateUpdateDomainComponent,
    data: {roles: ['ADMINISTRATOR']},
  },
  {
    path: 'create-category', canActivate: [AppGuard], component: CreateUpdateCategoryComponent,
    data: {roles: ['ADMINISTRATOR']},
  },
  {
    path: 'skills',
    canActivate: [AppGuard],
    component: ListSearchSkillComponent,
    data: {roles: ['ADMINISTRATOR']},
  },
  {
    path: 'domains', canActivate: [AppGuard], component: ListSearchDomainComponent,
    data: {roles: ['ADMINISTRATOR']},
  },
  {
    path: 'categories', canActivate: [AppGuard], component: ListSearchCategoryComponent,
    data: {roles: ['ADMINISTRATOR']},
  },
  {
    path: 'update-skill/:id', canActivate: [AppGuard], component: CreateUpdateSkillComponent,
    data: {roles: ['ADMINISTRATOR']},
  },
  {
    path: 'update-domain/:id', canActivate: [AppGuard], component: CreateUpdateDomainComponent,
    data: {roles: ['ADMINISTRATOR']},
  },
  {
    path: 'update-category/:id', canActivate: [AppGuard], component: CreateUpdateCategoryComponent,
    data: {roles: ['ADMINISTRATOR']},
  },
  {path: 'my-skills', canActivate: [AppGuard], component: MyEmployeeSkillsComponent},
  {
    path: 'employee/:id/skills',
    canActivate: [AppGuard],
    data: {roles: ['MANAGER', 'ADMINISTRATOR']},
    component: MyEmployeeSkillsComponent
  },
  {
    path: 'register-employee', canActivate: [AppGuard], component: CreateUpdateEmployeeComponent,
    data: {roles: ['ADMINISTRATOR']},
  },
  {path: 'update-employee', canActivate: [AppGuard], component: CreateUpdateEmployeeComponent},
  {path: 'skills/objective', canActivate: [AppGuard], component: MyEmployeeObjectivesComponent},
  {
    path: 'employees/skills/objective',
    canActivate: [AppGuard],
    data: {roles: ['MANAGER', 'ADMINISTRATOR']},
    component: ManagerViewEmployeeObjectivesComponent
  },
  {path: 'employeeAssessment', canActivate: [AppGuard], component: EmployeeAssessmentComponent},
  {path: 'addEmployeeAssessment', canActivate: [AppGuard], component: EmployeeAssesmentAddSkillComponent},
  {path: 'updateSkillAssessment', canActivate: [AppGuard], component: UpdateSkillAssessmentRecordComponent},
  {path: 'updateSkillAssessment/:id', canActivate: [AppGuard], component: UpdateSkillAssessmentRecordComponent},
  {
    path: 'managerAssessmentsReview',
    canActivate: [AppGuard],
    data: {roles: ['MANAGER', 'ADMINISTRATOR']},
    component: ManagerEmployeeAssessmentsComponent
  },
  {path: 'reviewerAssessment', canActivate: [AppGuard], component: ReviewerAssessmentComponent},
  {
    path: 'trackProgress',
    canActivate: [AppGuard],
    data: {roles: ['MANAGER', 'ADMINISTRATOR']},
    component: TrackingProgressComponent
  },
  {path: '**', redirectTo: 'page-not-found', pathMatch: 'full'}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
