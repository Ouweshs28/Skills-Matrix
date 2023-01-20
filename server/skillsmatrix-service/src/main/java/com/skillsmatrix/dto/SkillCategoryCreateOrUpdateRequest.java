package com.skillsmatrix.dto;

import lombok.Data;

/**
 * @author zaf
 */
@Data
public class SkillCategoryCreateOrUpdateRequest {

    private String name;
    private String description;

}