package com.skillsmatrix.dto;

import com.skillsmatrix.persistence.enumeration.SkillLevel;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SkillSearchCriteria {

    private Long skillId;
    private String name;
    private SkillLevel skillLevel;

}
