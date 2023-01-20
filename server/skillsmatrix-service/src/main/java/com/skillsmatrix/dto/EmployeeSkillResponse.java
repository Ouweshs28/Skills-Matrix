package com.skillsmatrix.dto;

import com.skillsmatrix.persistence.enumeration.SkillLevel;
import lombok.Data;

/**
 * @author zaf
 */
@Data
public class EmployeeSkillResponse {

    private Long id;
    private Long employeeId;
    private SkillResponse skill;
    private SkillLevel skillLevel;
    private Long currentObjectiveId;

}
