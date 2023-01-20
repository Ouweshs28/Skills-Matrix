package com.skillsmatrix.dto;

import com.skillsmatrix.persistence.enumeration.SkillStatus;
import lombok.Data;

import javax.validation.constraints.NotNull;

/**
 * @author akn
 */
@Data
public class SkillHistoryReviewUpdateRequest {

    @NotNull
    private SkillStatus status;
    private String comments;

}