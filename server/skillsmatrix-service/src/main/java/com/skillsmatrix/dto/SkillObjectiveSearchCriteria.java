package com.skillsmatrix.dto;

import com.skillsmatrix.persistence.enumeration.SkillLevel;
import com.skillsmatrix.persistence.enumeration.SkillObjectiveStatus;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;

/**
 * @author akn
 */
@Builder
@Getter
public class SkillObjectiveSearchCriteria {

    private final SkillObjectiveStatus status;
    private final Long skillId;
    private final SkillLevel currentSkillLevel;
    private final LocalDate dateFrom;

}
