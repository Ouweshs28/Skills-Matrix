import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {SkillHistoryCreateRequest, SkillLevel, SkillResponse} from 'src/app/shared/model/model';
import {SkillApiService} from 'src/app/shared/services/api/skill/skill-api.service';

@Component({
  selector: 'app-skill-history-add-table-form',
  templateUrl: './skill-history-add-table-form.component.html',
  styleUrls: ['./skill-history-add-table-form.component.scss']
})
export class SkillHistoryAddTableFormComponent implements OnInit {

  @Input() skillHistory!: SkillHistoryCreateRequest;
  @Input() showDeleteButton: boolean;
  @Output() onDeleteSkillHistory: EventEmitter<string> = new EventEmitter();
  public addNewAssessmentSkill!: FormGroup;
  public skillNameList: SkillResponse[] = [];
  public searchValueSkill!: string;
  //@ts-ignore
  public skillLevelList: SkillLevel[] = SkillLevel.values();


  private defaultParam = {
    sortOrder: 'ASC',
    sortBy: 'name',
    pageNumber: 0,
    pageSize: 10000,
    keyword: '',
    existingSkill: null
  };

  constructor(private formBuilder: FormBuilder, private skillApiService: SkillApiService) {
  }

  ngOnInit(): void {
    this.initialiaseForm();
    this.getAllSkills();
  }

  public initialiaseForm(): void {
    this.addNewAssessmentSkill = this.formBuilder.group({
      skillNameValidation: ['', Validators.required],
      skillLevelValidation: ['', Validators.required],
      skillDescription: [{value: '', disabled: true}, Validators.required],
      skillComments: [null]
    });
  }

  public getAllSkills(): void {
    //@ts-ignore
    this.defaultParam.existingSkill = this.skillApiService.existingSkillId;
    this.skillApiService.searchSkills(this.defaultParam).subscribe((skill) => {
      this.skillNameList = skill.content;
    });
  }

  public skillOnKeyUp(event: any): void {
    this.searchValueSkill = event.target.value;
    this.defaultParam.keyword = this.searchValueSkill;
    this.skillApiService.searchSkills(this.defaultParam).subscribe((skill) => {
      this.skillNameList = skill.content;
    });
  }

  public populateDescCategDomainField(event: any) {

    this.skillNameList.filter(skill => {
      if (skill.id == event.value) {
        this.skillHistory.skillDescription = skill.description;
        console.log(skill.description);

      }
    });
  }

  public deleteSkillHistory(): void {
    this.onDeleteSkillHistory.emit(this.skillHistory.skillHistoryId);
  }

  onClose() {
    this.searchValueSkill = "";
    this.getAllSkills();
  }

}
