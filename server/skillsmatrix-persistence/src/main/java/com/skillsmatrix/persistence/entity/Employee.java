package com.skillsmatrix.persistence.entity;

import com.skillsmatrix.persistence.enumeration.EmploymentPosition;
import com.skillsmatrix.persistence.enumeration.Factory;
import com.skillsmatrix.persistence.enumeration.Gender;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "employee")
public class Employee extends AuditModel {

    @Id
    @Column(name = "id")
    @SequenceGenerator(
            name = "employee_sequence",
            sequenceName = "employee_sequence",
            allocationSize = 1
    )
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "employee_sequence"
    )
    private Long id;

    @Column(name = "first_name", nullable = false)
    private String firstName;

    @Column(name = "last_name", nullable = false)
    private String lastName;

    @Enumerated(EnumType.STRING)
    @Column(name = "gender", nullable = false)
    private Gender gender;

    @Column(name = "email", nullable = false)
    private String email;

    @Column(name = "visa", nullable = false)
    private String visa;

    @Enumerated(EnumType.STRING)
    @Column(name = "factory", nullable = false)
    private Factory factory;

    @Enumerated(EnumType.STRING)
    @Column(name = "position", nullable = false)
    private EmploymentPosition position;

    @ManyToOne
    @JoinColumn(name = "manager_id", referencedColumnName = "id")
    private Employee manager;

    @ManyToOne
    @JoinColumn(name = "employee_domain_id", referencedColumnName = "id")
    private EmployeeDomain employeeDomain;

    @Column(name = "archived", nullable = false, columnDefinition = "BOOLEAN DEFAULT false")
    private Boolean archived = false;

    @OneToMany(mappedBy = "employee")
    private List<EmployeeSkill> employeeSkills;

    public Employee(String firstName,
                    String lastName,
                    Gender gender,
                    String email,
                    String visa,
                    Factory factory,
                    EmploymentPosition position,
                    Employee manager,
                    EmployeeDomain employeeDomain) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.gender = gender;
        this.email = email;
        this.visa = visa;
        this.factory = factory;
        this.position = position;
        this.manager = manager;
        this.employeeDomain = employeeDomain;
    }

}
