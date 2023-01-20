package com.skillsmatrix.persistence.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "skill")
public class Skill extends AuditModel {

    @Id
    @Column(name = "id")
    @SequenceGenerator(
            name = "skill_sequence",
            sequenceName = "skill_sequence",
            allocationSize = 1
    )
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "skill_sequence"
    )
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_domain_id", nullable = false, referencedColumnName = "id")
    private EmployeeDomain employeeDomain;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "skills_category_id", nullable = false, referencedColumnName = "id")
    private SkillCategory skillCategory;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "description")
    private String description;

    @Column(name = "level_requirements")
    private String levelRequirements;

    @Column(name = "archived", columnDefinition = "BOOLEAN DEFAULT false")
    public Boolean archived = false;

    public Skill(EmployeeDomain employeeDomain,
                 SkillCategory skillCategory,
                 String name,
                 String description,
                 String levelRequirements) {
        this.employeeDomain = employeeDomain;
        this.skillCategory = skillCategory;
        this.name = name;
        this.description = description;
        this.levelRequirements = levelRequirements;
    }

    public Skill(EmployeeDomain employeeDomain,
                 SkillCategory skillCategory,
                 String name,
                 String description) {
        this.employeeDomain = employeeDomain;
        this.skillCategory = skillCategory;
        this.name = name;
        this.description = description;
    }

}