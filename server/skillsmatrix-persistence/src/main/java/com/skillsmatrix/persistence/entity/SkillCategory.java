package com.skillsmatrix.persistence.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "skill_category")
public class SkillCategory extends AuditModel {

    @Id
    @Column(name = "id")
    @SequenceGenerator(
            name = "skill_category_sequence",
            sequenceName = "skill_category_sequence",
            allocationSize = 1
    )
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "skill_category_sequence"
    )
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "description")
    private String description;

    @Column(name = "archived", columnDefinition = "BOOLEAN DEFAULT false")
    public Boolean archived = false;

    public SkillCategory(String name,
                         String description) {
        this.name = name;
        this.description = description;
    }

}