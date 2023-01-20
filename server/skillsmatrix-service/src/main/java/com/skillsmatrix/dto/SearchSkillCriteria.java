package com.skillsmatrix.dto;

import lombok.Builder;
import lombok.Data;

/**
 * @author zaf
 */
@Builder
@Data
public class SearchSkillCriteria {

    private String skillName;
    private String skillDescription;
    private Long categoryId;
    private String categoryName;
    private Long domainId;
    private String domainName;

}