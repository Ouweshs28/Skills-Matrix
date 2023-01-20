package com.skillsmatrix.mapper;

import com.skillsmatrix.dto.SkillHistoryCreateRequest;
import com.skillsmatrix.dto.SkillHistoryResponse;
import com.skillsmatrix.persistence.entity.SkillHistory;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

/**
 * @author zaf
 */
@Mapper(componentModel = "spring")
public interface SkillHistoryMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "approvalDate", ignore = true)
    @Mapping(target = "employee", ignore = true)
    @Mapping(target = "reviewer", ignore = true)
    @Mapping(target = "skill", ignore = true)
    @Mapping(target = "status", defaultValue = "PENDING")
    SkillHistory mapToSkillHistoryEntity(SkillHistoryCreateRequest skillHistoryCreateRequest);

    @Mapping(target = "skillId", source = "skill.id")
    @Mapping(target = "skillName", source = "skill.name")
    @Mapping(target = "skillDescription", source = "skill.description")
    @Mapping(target = "employeeDomainName", source = "skill.employeeDomain.name")
    @Mapping(target = "skillCategoryName", source = "skill.skillCategory.name")
    @Mapping(target = "employeeId", source = "employee.id")
    @Mapping(target = "reviewerId", source = "reviewer.id")
    @Mapping(target = "reviewerName", source = "reviewer.firstName")
    SkillHistoryResponse mapToSkillHistoryResponse(SkillHistory skillHistory);

}
