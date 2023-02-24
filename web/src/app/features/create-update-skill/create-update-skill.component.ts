import {Component, OnInit} from '@angular/core';
import {UntypedFormControl, UntypedFormGroup, Validators} from '@angular/forms';
import {EmployeeDomainResponse, SkillCategoryResponse, SkillCreateOrUpdateRequest,} from 'src/app/shared/model/model';
import {SkillApiService} from '../../shared/services/api/skill/skill-api.service';
import {ToastrService} from 'ngx-toastr';
import {ActivatedRoute, Router} from '@angular/router';
import {AdminApiService} from "../../shared/services/api/admin/admin-api.service";

@Component({
  selector: 'app-create-update-skill',
  templateUrl: './create-update-skill.component.html',
  styleUrls: ['./create-update-skill.component.scss'],
})
export class CreateUpdateSkillComponent implements OnInit {
  public skillAdditionUpdateForm!: UntypedFormGroup;
  public employeeDomainList: EmployeeDomainResponse[] = [];
  public skillCategoryList: SkillCategoryResponse[] = [];
  public skill!: any;
  public domains = new UntypedFormControl();
  public title!: String;
  public buttonName!: String;
  public skillId!: number;
  public isUpdate!: Boolean;
  private defaultParam = {
    sortOrder: 'ASC',
    sortBy: 'name',
    pageNumber: 0,
    pageSize: 1000,
  };

  constructor(
    private skillApiService: SkillApiService,
    private adminApiService: AdminApiService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.initialiseSkill();
    this.initialiseSkillAdditionForm();
    this.populateEmployeeDomainList();
    this.populateSkillCategoryList();
    this.checkRouterLink();
  }

  public checkOperationType(): void {
    if (!this.isUpdate) {
      this.createSkill();
    } else {
      this.updateSkill(this.skill);
    }
  }

  private initialiseSkill(): void {
    this.skill = {
      name: '',
      description: '',
      employeeDomainId: 0,
      skillCategoryId: 0,
      levelRequirements: '',
    };
  }

  private initialiseSkillAdditionForm(): void {
    this.skillAdditionUpdateForm = new UntypedFormGroup({
      skillName: new UntypedFormControl(null, [
        Validators.required,
        Validators.pattern('[a-zA-Z ]*'),
      ]),
      skillLevelRequirements: new UntypedFormControl(null, [
        Validators.required,
        Validators.pattern('^[.a-zA-Z0-9, ]*$'),
      ]),
      skillDescription: new UntypedFormControl(null, [
        Validators.required,
        Validators.pattern('^[.a-zA-Z0-9, ]*$'),
      ]),
      skillDomain: new UntypedFormControl(null, Validators.required),
      skillCategory: new UntypedFormControl(null, Validators.required),
    });
  }

  private populateEmployeeDomainList(): void {
    this.skillApiService.searchEmployeeDomains(this.defaultParam).subscribe(
      (domains) => {
        this.employeeDomainList = domains.content;
      }
    );
  }

  private populateSkillCategoryList(): void {
    this.skillApiService.searchSkillCategories(this.defaultParam).subscribe(
      (categories) => {
        this.skillCategoryList = categories.content;
      }
    );
  }

  private checkRouterLink(): void {
    if (this.router.url.startsWith('/update-skill/')) {
      this.title = 'Update skill';
      this.buttonName = 'Update';
      this.isUpdate = true;
      this.getSkillProperties();
    } else {
      this.title = 'Add new skill';
      this.buttonName = 'Submit';
    }
  }

  private getSkillProperties(): void {
    this.skillId = this.route.snapshot.params['id'];
    this.adminApiService.findSkillById(this.skillId).subscribe(
      (skillResponse) => {
        this.skill = skillResponse;
        this.skill.employeeDomainId = skillResponse.employeeDomain.id;
        this.skill.skillCategoryId = skillResponse.skillCategory.id;
      }
    );
  }

  private createSkill(): void {
    this.adminApiService.createSkill(this.skill).subscribe((skills) => {
      this.toastr.success('Skill ' + this.skill.name + ' successfully added!');
    });
    setTimeout(() => {
      this.router.navigate(['skills']);
    }, 2000);
  }

  public updateSkill(skill: SkillCreateOrUpdateRequest): void {
    this.adminApiService.updateSkill(skill, this.skillId).subscribe(() => {
      this.toastr.success('Skill ' + this.skill.name + ' successfully added!');
    });
    setTimeout(() => {
      this.router.navigate(['skills']);
    }, 2000);
  }
}
