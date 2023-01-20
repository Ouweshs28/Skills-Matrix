package com.skillsmatrix.dto;

import com.skillsmatrix.persistence.enumeration.SkillStatus;
import lombok.Builder;
import lombok.Getter;

/**
 * @author akn
 */
@Builder
@Getter
public class SkillHistorySearchCriteria {

    private final Long skillId;
    private final String keyword;
    private final SkillStatus skillStatus;

}
