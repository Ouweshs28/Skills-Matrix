package com.skillsmatrix.dto;

import lombok.Data;

/**
 * @author zaf
 */
@Data
public class SkillCategoryResponse {

    private Long id;
    private String name;
    private String description;
    private Boolean archived;

}