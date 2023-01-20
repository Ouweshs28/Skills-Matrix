package com.skillsmatrix.dto;

import com.skillsmatrix.persistence.enumeration.SkillLevel;
import lombok.Builder;
import lombok.Data;

/**
 * @author zaf
 */
@Builder
@Data
public class SearchSkillLevel {

    private Long id;
    private SkillLevel level;

    public SearchSkillLevel(Long id, SkillLevel level) {
        this.id = id;
        this.level = level;
    }
}
