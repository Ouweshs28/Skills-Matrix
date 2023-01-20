package com.skillsmatrix.persistence.entity;

import com.skillsmatrix.persistence.enumeration.SkillLevel;
import com.skillsmatrix.persistence.enumeration.SkillObjectiveStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "skill_objective")
public class SkillObjective extends AuditModel {

    @Id
    @Column(name = "id")
    @SequenceGenerator(
            name = "skill_objective_sequence",
            sequenceName = "skill_objective_sequence",
            allocationSize = 1
    )
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "skill_objective_sequence"
    )
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false, referencedColumnName = "id")
    private Employee employee;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "skill_id", nullable = false, referencedColumnName = "id")
    private Skill skill;

    @Enumerated(EnumType.STRING)
    @Column(name = "current_skill_level", nullable = false)
    private SkillLevel currentSkillLevel;

    @Enumerated(EnumType.STRING)
    @Column(name = "target_skill_level", nullable = false)
    private SkillLevel targetSkillLevel;

    @Column(name = "target_date")
    private LocalDate targetDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private SkillObjectiveStatus status;

}