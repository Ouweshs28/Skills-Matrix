import {AfterContentInit, Component} from '@angular/core';
import {EmployeeResponse, EmployeeSkillResponse, ManagerResponse, SkillLevel} from 'src/app/shared/model/model';
import {EmployeeApiService} from 'src/app/shared/services/api/employee/employee-api.service';
import {Chart} from 'chart.js';
import {ManagerApiService} from "../../shared/services/api/manager/manager-api.service";
import {StateService} from "../../shared/services/state/state.service";

@Component({
  selector: 'app-tracking-progress',
  templateUrl: './tracking-progress.component.html',
  styleUrls: ['./tracking-progress.component.scss'],
})
export class TrackingProgressComponent implements AfterContentInit {
  public selectedEmployee!: EmployeeResponse;
  public hasSelectedAnEmployeeForProgressTracking!: boolean;
  public employeesList: ManagerResponse[] = [];
  public searchEmployeeByName!: string;
  public tempEmployeeName: string = '';
  public tabs = ['Profile', 'Skills'];
  public selectedTab: string = 'Profile';
  public employee!: EmployeeResponse;
  public selectedEmployeeListOfSkills: EmployeeSkillResponse[] = [];
  //@ts-ignore
  public skillLevelList: SkillLevel[] = SkillLevel.values();
  public chartSkillNameLabels: string[] = [];
  public chartSkillLevelIndex: number[] = [];
  public barChartGraph: Chart;

  private defaultParam = {
    sortOrder: 'ASC',
    sortBy: 'firstName',
    pageNumber: 0,
    pageSize: 10000,
    employeeName: '',
  };

  constructor(private employeeApiService: EmployeeApiService,
              private managerApiService: ManagerApiService,
              private stateService: StateService) {
  }

  ngAfterContentInit(): void {
    this.getEmployeeList(this.tempEmployeeName);
  }


  public getEmployeeSelected(event: any): void {
    this.selectedEmployee = event.value;
    this.getEmployeeDetails();
    this.getSelectedUserEmployeeSkills();
  }

  public employeeNameOnKeyUp(event: any): void {
    this.getEmployeeList(event.target.value);
  }

  public tabClick(event: any) {
    this.selectedTab = event.tab.textLabel;
    if (this.selectedTab == 'Skills') {
      this.getEmployeeDetails();
      this.getSelectedUserEmployeeSkills();
    }
  }

  public initialiseChart(): void {
    if (this.barChartGraph !== undefined) this.barChartGraph.destroy();
    this.barChartGraph = new Chart('myChart', {
      type: 'bar',
      data: {
        labels: this.chartSkillNameLabels,
        datasets: [
          {
            label: 'Employee Current Skills',
            data: this.chartSkillLevelIndex,
            backgroundColor: [
              'rgba(255, 99, 12, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)',
            ],
            borderColor: [
              'rgba(255, 99, 12, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)',
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            ticks: {
              stepSize: 1,
              callback: function (value, index, values) {
                if (value == 1) {
                  return 'Novice';
                } else if (value == 2) {
                  return 'Beginner';
                } else if (value == 3) {
                  return 'Proficient';
                } else if (value == 4) {
                  return 'Advanced';
                } else if (value == 5) {
                  return 'Expert';
                } else {
                  return '';
                }
              },
            },
            beginAtZero: true,
            min: 0,
            max: 5,
          },
        },
      },
    });
  }

  private getEmployeeList(employeeName: string): void {
    this.defaultParam.employeeName = employeeName;
    this.managerApiService
      .searchManagersEmployees(this.stateService.loggedInUser.id, this.defaultParam)
      .subscribe((employees) => {
        this.employeesList = employees.content;
      });
  }

  private getEmployeeDetails(): void {
    this.managerApiService.findEmployeeById(this.selectedEmployee.id).subscribe(
      (employee) => {
        this.employee = employee;

      },
      (error) => {
        console.log(error);
      },
      () => {
        this.hasSelectedAnEmployeeForProgressTracking = true;
      }
    );
  }

  private getSelectedUserEmployeeSkills(): void {
    let defaultParam = {
      sortOrder: 'ASC',
      sortBy: 'skill.name',
      pageNumber: 0,
      pageSize: 100000,
    };

    this.managerApiService
      .findEmployeeSkills(this.selectedEmployee.id, defaultParam)
      .subscribe((employeeSkills) => {
        this.selectedEmployeeListOfSkills = employeeSkills.content;
        this.populateChartLabelAndData();
        this.initialiseChart();
      });
  }

  private populateChartLabelAndData(): void {
    this.chartSkillLevelIndex.length = 0;
    this.chartSkillNameLabels.length = 0;

    for (var index = 0; index < this.selectedEmployeeListOfSkills.length; index++) {
      this.chartSkillNameLabels.push(
        this.selectedEmployeeListOfSkills[index].skill.name
      );
      this.chartSkillLevelIndex.push(
        this.getChartSkillLevelCode(
          this.selectedEmployeeListOfSkills[index].skillLevel.label
        )
      );
    }
  }

  private getChartSkillLevelCode(skillLevelLabel: string): number {
    const skillLevelObtained = this.skillLevelList.find(obj => obj.label === skillLevelLabel);
    return skillLevelObtained?.code ?? 0;
  }

  onClose() {
    this.searchEmployeeByName = "";
    this.getEmployeeList(this.searchEmployeeByName);
  }
}
