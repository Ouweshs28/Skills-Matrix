package com.skillsmatrix.dto;

import lombok.Data;

import javax.validation.constraints.NotNull;

/**
 * @author zaf
 */
@Data
public class SkillCreateOrUpdateRequest {

    @NotNull
    private Long employeeDomainId;
    @NotNull
    private Long skillCategoryId;
    private String name;
    private String description;
    private String levelRequirements;

}
