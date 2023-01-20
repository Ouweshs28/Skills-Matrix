package com.skillsmatrix.dto;

import com.skillsmatrix.persistence.enumeration.SkillLevel;
import com.skillsmatrix.persistence.enumeration.SkillObjectiveStatus;
import lombok.Data;

import java.time.LocalDate;

/**
 * @author ows
 */
@Data
public class SkillObjectiveUpdateRequest {

    private SkillLevel targetSkillLevel;
    private LocalDate targetDate;
    private SkillObjectiveStatus status;

}
