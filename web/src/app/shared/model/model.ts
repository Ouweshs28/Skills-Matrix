/* tslint:disable */
/* eslint-disable */

// Generated using typescript-generator version 2.22.595 on 2021-12-09 17:32:47.

export class CreateUserRequest {
  id: number;
  genderEnum: Gender;
}

export class DocumentDto {
  id: number;
  employeeId: number;
  employeeSkillId: number;
  name: string;
  fileName: string;
  filePath: string;
  docType: DocumentType;
}

export class EmployeeCreateOrUpdateRequest {
  firstName: string;
  lastName: string;
  gender: Gender;
  email: string;
  factory: Factory;
  position: EmploymentPosition;
  managerId: number;
  employeeDomainId: number;
}

export class EmployeeDomainCreateOrUpdateRequest {
  name: string;
  description: string;
}

export class EmployeeDomainResponse {
  id: number;
  name: string;
  description: string;
  archived: boolean;
}

export class EmployeeResponse {
  id: number;
  firstName: string;
  lastName: string;
  gender: Gender;
  email: string;
  factory: Factory;
  position: EmploymentPosition;
  manager: ManagerResponse;
  employeeDomain: EmployeeDomainResponse;
}

export class EmployeeSkillResponse {
  id: number;
  employeeId: number;
  skill: SkillResponse;
  skillLevel: SkillLevel;
  currentObjectiveId: number;
}

export class ManagerResponse {
  id: number;
  firstName: string;
  lastName: string;
}

export class SearchEmployeeCriteria {
  employeeName: string;
  skillLevel: SearchSkillLevel[];
  domainList: number[];
  factory: Factory;
  employeeId: number[];
  managerId: number;
}

export class SearchSkillCriteria {
  skillName: string;
  skillDescription: string;
  categoryId: number;
  categoryName: string;
  domainId: number;
  domainName: string;
}

export class SearchSkillLevel {
  id: number;
  level: SkillLevel;
}

export class SkillCategoryCreateOrUpdateRequest {
  name: string;
  description: string;
}

export class SkillCategoryResponse {
  id: number;
  name: string;
  description: string;
  archived: boolean;
}

export class SkillCreateOrUpdateRequest {
  employeeDomainId: number;
  skillCategoryId: number;
  name: string;
  description: string;
  levelRequirements: string;
}

export class SkillHistoryCreateRequest {
  skillHistoryId?: string;
  skillDescription?: string;
  skillDomain?: string;
  skillCategory?: string;
  skillName?: string;
  skillId: number;
  skillLevel: SkillLevel;
  comments: string;

  constructor(skillHistoryId?: string) {
    this.skillHistoryId = skillHistoryId;
  }
}

export class SkillHistoryResponse {
  id: number;
  skillId: number;
  skillName: string;
  skillDescription: string;
  skillLevel: SkillLevel;
  status: SkillStatus;
  comments: string;
  employeeId: number;
  reviewerId: number;
  reviewerName: string;
  employeeDomainName: string;
  skillCategoryName: string;
}

export class SkillHistoryReviewUpdateRequest {
  status: SkillStatus;
  comments: string;
}

export class SkillHistorySearchCriteria {
  skillId: number;
  keyword: string;
  skillStatus: SkillStatus;
}

export class SkillHistoryUpdateRequest {
  skillLevel: SkillLevel;
  comments: string;
}

export class SkillObjectiveCreateRequest {
  skillId: number;
  targetSkillLevel: SkillLevel;
  targetDate: Date;
}

export class SkillObjectiveResponse {
  id: number;
  skill: SkillResponse;
  currentSkillLevel: SkillLevel;
  targetSkillLevel: SkillLevel;
  targetDate: Date;
  status: SkillObjectiveStatus;
  employee: ManagerResponse;

}

export class SkillObjectiveSearchCriteria {
  status: SkillObjectiveStatus;
  skillId: number;
  currentSkillLevel: SkillLevel;
}

export class SkillObjectiveUpdateRequest {
  targetSkillLevel: SkillLevel;
  targetDate: Date;
  status: SkillObjectiveStatus;
}

export class SkillResponse {
  id: number;
  employeeDomain: EmployeeDomainResponse;
  skillCategory: SkillCategoryResponse;
  name: string;
  description: string;
  levelRequirements: string;
  archived: boolean;
}

export class SkillSearchCriteria {
  skillId: number;
  name: string;
  skillLevel: SkillLevel;
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

export enum DocumentType {
  CERTIFICATE = 'CERTIFICATE',
  CV = 'CV',
  SLIDE = 'SLIDE',
  OTHER = 'OTHER',
}

export enum SkillStatus {
  APPROVED = 'APPROVED',
  PENDING = 'PENDING',
  DECLINED = 'DECLINED',
  ALL = 'ALL'
}

export enum SkillObjectiveStatus {
  NEW = 'NEW',
  INCOMPLETE = 'INCOMPLETE',
  COMPLETE = 'COMPLETE',
}


export class Page<T> {
  content!: T;
  totalPages!: number;
  totalElements!: number;
}

export class EventData {
  name: string;
  value: any;

  constructor(name: string, value: any) {
    this.name = name;
    this.value = value;
  }
}


import {Enum, EnumType} from "ts-jenum";

@Enum("label")
export class EmploymentPosition extends EnumType<EmploymentPosition>() {

  static readonly BA_ASSOCIATE_BA = new EmploymentPosition(1, "Associate Business Analyst");
  static readonly BA_SENIOR_BA = new EmploymentPosition(2, "Senior Business Analyst");
  static readonly ENGINEERING_TRAINEE = new EmploymentPosition(3, "Trainee");
  static readonly ENGINEERING_ASSOCIATE_SOFTWARE_ENGINEER = new EmploymentPosition(4, "Associate Software Engineer");
  static readonly ENGINEERING_SOFTWARE_ENGINEER = new EmploymentPosition(5, "Software Engineer");
  static readonly ENGINEERING_SENIOR_SOFTWARE_ENGINEER = new EmploymentPosition(6, "Senior Software Engineer");
  static readonly ENGINEERING_ASSOCIATE_ARCHITECT = new EmploymentPosition(7, "Associate Architect");
  static readonly ENGINEERING_ARCHITECT = new EmploymentPosition(8, "Architect");
  static readonly ENGINEERING_SENIOR_ARCHITECT = new EmploymentPosition(9, "Senior Architect");
  static readonly EXPERT_ASSOCIATE_EXPERT = new EmploymentPosition(10, "Associate Expert");
  static readonly EXPERT_EXPERT = new EmploymentPosition(11, "Expert");
  static readonly EXPERT_SENIOR_EXPERT = new EmploymentPosition(12, "Senior Expert");
  static readonly MANAGEMENT_ASSOCIATE_PROJECT_MANAGER = new EmploymentPosition(13, "Associate Project Manager");
  static readonly MANAGEMENT_PROJECT_MANAGER = new EmploymentPosition(14, "Project Manager");
  static readonly MANAGEMENT_SENIOR_MANAGER = new EmploymentPosition(15, "Senior Manager");
  static readonly QA_ASSOCIATE_QA = new EmploymentPosition(16, "Associate QA");
  static readonly QA_QA = new EmploymentPosition(17, "QA");
  static readonly QA_SENIOR_QA = new EmploymentPosition(18, "Senior QA");

  private constructor(readonly code: number, readonly label: string) {
    super();
  }

}

@Enum("label")
export class Factory extends EnumType<Factory>() {

  static readonly ENGINEERING = new Factory(1, "Engineering");
  static readonly IPENSION = new Factory(2, "iPension");

  private constructor(readonly code: number, readonly label: string) {
    super();
  }
}

@Enum("label")
export class SkillLevel extends EnumType<SkillLevel>() {
  static readonly P0 = new SkillLevel(1, 'Novice');
  static readonly P1 = new SkillLevel(2, 'Beginner');
  static readonly P2 = new SkillLevel(3, 'Proficient');
  static readonly P3 = new SkillLevel(4, 'Advanced');
  static readonly P4 = new SkillLevel(5, 'Expert');

  private constructor(readonly code: number, readonly label: string) {
    super();
  }

}

export interface AppConfigModel {
  keycloakUrl: string;
  keycloakRealm: string;
  keycloakClientId: string;
}
