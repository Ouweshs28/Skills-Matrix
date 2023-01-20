package com.skillsmatrix.dto;

import lombok.Data;

/**
 * @author zaf
 */
@Data
public class SkillResponse {

    private Long id;
    private EmployeeDomainResponse employeeDomain;
    private SkillCategoryResponse skillCategory;
    private String name;
    private String description;
    private String levelRequirements;
    private Boolean archived;

}