package com.skillsmatrix.mapper;

import com.skillsmatrix.dto.EmployeeSkillResponse;
import com.skillsmatrix.persistence.entity.EmployeeSkill;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

/**
 * @author zaf
 */
@Mapper(componentModel = "spring")
public interface EmployeeSkillMapper {

    @Mapping(target = "employeeId", source = "employee.id")
    @Mapping(target = "currentObjectiveId", source = "currentObjective.id")
    EmployeeSkillResponse mapToEmployeeSkillResponse(EmployeeSkill employeeSkill);

}