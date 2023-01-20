import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {EmployeeDomainCreateOrUpdateRequest} from 'src/app/shared/model/model';
import {ToastrService} from 'ngx-toastr';
import {ActivatedRoute, Router} from '@angular/router';
import {AdminApiService} from "../../shared/services/api/admin/admin-api.service";

@Component({
  selector: 'app-create-update-domain',
  templateUrl: './create-update-domain.component.html',
  styleUrls: ['./create-update-domain.component.scss'],
})

export class CreateUpdateDomainComponent implements OnInit {
  public domainAdditionUpdateForm!: FormGroup;
  public domain!: any;
  public title!: String;
  public buttonName!: String;
  public domainId!: number;
  public isUpdate!: Boolean;

  constructor(
    private adminServiceApi: AdminApiService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    this.initialiseDomain();
    this.initialiseDomainAdditionUpdateForm();
    this.checkRouterLink();
  }

  public checkOperationType(): void {
    if (!this.isUpdate) {
      this.createDomain();
    } else {
      this.updateDomain(this.domain);
    }
  }

  private initialiseDomain(): void {
    this.domain = {
      name: '',
      description: '',
    };
  }

  private initialiseDomainAdditionUpdateForm(): void {
    this.domainAdditionUpdateForm = new FormGroup({
      domainName: new FormControl(null, [
        Validators.required,
        Validators.pattern('[a-zA-Z/., ]*'),
      ]),
      domainDescription: new FormControl(null, [
        Validators.required,
        Validators.pattern('[a-zA-Z/.,0-9- ]*'),
      ]),
    });
  }

  private checkRouterLink(): void {
    if (this.router.url.startsWith('/update-domain/')) {
      this.title = 'Update domain';
      this.buttonName = 'Update';
      this.isUpdate = true;
      this.getDomainProperties();
    } else {
      this.title = 'Add new domain';
      this.buttonName = 'Submit';
    }
  }

  private getDomainProperties(): void {
    this.domainId = this.route.snapshot.params['id'];
    this.adminServiceApi.findEmployeeDomainById(this.domainId).subscribe(
      (domainRespone) => {
        this.domain = domainRespone;
      }
    );
  }

  private createDomain(): void {
    this.adminServiceApi.createEmployeeDomain(this.domain).subscribe((domains) => {
      this.toastr.success(
        'Domain ' + this.domain.name + ' successfully added!'
      );
    });
    setTimeout(() => {
      this.router.navigate(['domains']);
    }, 2000);
  }

  private updateDomain(domain: EmployeeDomainCreateOrUpdateRequest): void {
    this.adminServiceApi.updateEmployeeDomain(domain, this.domainId).subscribe(() => {
      this.toastr.success(
        'Domain ' + this.domain.name + ' successfully updated!'
      );
    });
    setTimeout(() => {
      this.router.navigate(['domains']);
    }, 2000);
  }
}
