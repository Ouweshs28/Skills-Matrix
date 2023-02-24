import {AfterContentInit, Component} from '@angular/core';
import {UntypedFormControl, UntypedFormGroup, Validators} from '@angular/forms';
import {SkillCategoryCreateOrUpdateRequest} from 'src/app/shared/model/model';
import {ToastrService} from 'ngx-toastr';
import {ActivatedRoute, Router} from '@angular/router';
import {AdminApiService} from "../../shared/services/api/admin/admin-api.service";
import {StateService} from "../../shared/services/state/state.service";

@Component({
  selector: 'app-create-update-category',
  templateUrl: './create-update-category.component.html',
  styleUrls: ['./create-update-category.component.scss'],
})

export class CreateUpdateCategoryComponent implements AfterContentInit {
  public category!: any;
  public title!: String;
  public buttonName!: String;
  public categoryId!: number;
  public isUpdate!: Boolean;
  public categoryAdditionUpdateForm!: UntypedFormGroup;
  public currentUserSessionId!: number;


  constructor(
    private adminApiService: AdminApiService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private stateService: StateService
  ) {
  }

  ngAfterContentInit(): void {
    this.getUserSessionDetails();
    this.initialiseCategoryAdditionUpdateForm();
    this.initialiseCategory();
    this.checkRouterLink();
  }

  public checkOperationType(): void {
    if (!this.isUpdate) {
      this.createCategory();
    } else {
      this.updateCategory(this.category);
    }
  }

  private initialiseCategoryAdditionUpdateForm(): void {
    this.categoryAdditionUpdateForm = new UntypedFormGroup({
      categoryName: new UntypedFormControl(null, [
        Validators.required,
        Validators.pattern('[a-zA-Z/., ]*'),
      ]),
      categoryDescription: new UntypedFormControl(null, [
        Validators.required,
        Validators.pattern('[a-zA-Z/.,0-9- ]*'),
      ]),
    });
  }

  private initialiseCategory(): void {
    this.category = {
      name: '',
      description: '',
    };
  }

  private checkRouterLink(): void {
    if (this.router.url.startsWith('/update-category/')) {
      this.title = 'Update domain';
      this.buttonName = 'Update';
      this.isUpdate = true;
      this.getCategoryProperties();
    } else {
      this.title = 'Add new category';
      this.buttonName = 'Submit';
    }
  }

  private getCategoryProperties(): void {
    this.categoryId = this.route.snapshot.params['id'];
    this.adminApiService.findSkillCategoryById(this.categoryId).subscribe(
      (categoryResponse) => {
        this.category = categoryResponse;
      }
    );
  }

  private createCategory(): void {
    this.adminApiService.createSkillCategory(this.category).subscribe((category) => {
      this.toastr.success(
        'Category ' + this.category.name + ' successfully added!'
      );
    });
    setTimeout(() => {
      this.router.navigate(['categories']);
    }, 2000);
  }

  private updateCategory(category: SkillCategoryCreateOrUpdateRequest): void {
    this.adminApiService.updateSkillCategory(category, this.categoryId).subscribe(
      () => {
        this.toastr.success(
          'Category ' + this.category.name + ' successfully updated!'
        );
      }
    );
    setTimeout(() => {
      this.router.navigate(['categories']);
    }, 2000);
  }

  private getUserSessionDetails(): void {
    if (this.stateService.loggedInUser != undefined) {
      this.currentUserSessionId = this.stateService.loggedInUser.id
    }
  }
}
