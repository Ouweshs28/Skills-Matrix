package com.skillsmatrix.dto;

import com.skillsmatrix.persistence.enumeration.SkillLevel;
import com.skillsmatrix.persistence.enumeration.SkillStatus;
import lombok.Data;

import javax.validation.constraints.NotNull;

/**
 * @author zaf
 */
@Data
public class SkillHistoryCreateRequest {

    @NotNull
    private Long skillId;
    @NotNull
    private SkillLevel skillLevel;
    private String comments;
    private SkillStatus status;

}