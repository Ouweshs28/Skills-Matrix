package com.skillsmatrix.dto;

import com.skillsmatrix.persistence.enumeration.SkillLevel;
import com.skillsmatrix.persistence.enumeration.SkillObjectiveStatus;
import lombok.Data;

import java.time.LocalDate;

/**
 * @author zaf
 */
@Data
public class SkillObjectiveResponse {

    private Long id;
    private SkillResponse skill;
    private SkillLevel currentSkillLevel;
    private SkillLevel targetSkillLevel;
    private LocalDate targetDate;
    private SkillObjectiveStatus status;
    private ManagerResponse employee;

}
