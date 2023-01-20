package com.skillsmatrix.mapper;

import com.skillsmatrix.dto.SkillCreateOrUpdateRequest;
import com.skillsmatrix.dto.SkillResponse;
import com.skillsmatrix.persistence.entity.Skill;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

/**
 * @author zaf
 */
@Mapper(componentModel = "spring")
public interface SkillMapper {

    @Mapping(target = "createdOn", ignore = true)
    @Mapping(target = "updatedOn", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "archived", defaultValue = "false")
    @Mapping(target = "employeeDomain", ignore = true)
    @Mapping(target = "skillCategory", ignore = true)
    Skill mapToSkillEntity(SkillCreateOrUpdateRequest skillCreateOrUpdateRequest);

    @Mapping(target = "createdOn", ignore = true)
    @Mapping(target = "updatedOn", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "archived", defaultValue = "false")
    @Mapping(target = "employeeDomain", ignore = true)
    @Mapping(target = "skillCategory", ignore = true)
    void mapToSkillEntity(@MappingTarget Skill skill, SkillCreateOrUpdateRequest skillCreateOrUpdateRequest);

    SkillResponse mapToSkillResponse(Skill skill);

}
