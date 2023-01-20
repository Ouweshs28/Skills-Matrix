package com.skillsmatrix.dto;

import com.skillsmatrix.persistence.enumeration.SkillLevel;
import lombok.Data;

import javax.validation.constraints.NotNull;

/**
 * @author zaf
 */
@Data
public class SkillHistoryUpdateRequest {

    @NotNull
    private SkillLevel skillLevel;
    private String comments;

}