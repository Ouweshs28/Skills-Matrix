package com.skillsmatrix.mapper;

import com.skillsmatrix.dto.SkillObjectiveCreateRequest;
import com.skillsmatrix.dto.SkillObjectiveResponse;
import com.skillsmatrix.dto.SkillObjectiveUpdateRequest;
import com.skillsmatrix.persistence.entity.SkillObjective;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

/**
 * @author zaf
 */
@Mapper(componentModel = "spring")
public interface SkillObjectiveMapper {

    SkillObjectiveResponse mapToSkillObjectiveResponse(SkillObjective skillObjective);

    @Mapping(target = "createdOn", ignore = true)
    @Mapping(target = "updatedOn", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "currentSkillLevel", ignore = true)
    @Mapping(target = "employee", ignore = true)
    @Mapping(target = "skill", ignore = true)
    @Mapping(target = "status", defaultValue = "NEW")
    SkillObjective mapToSkillObjective(SkillObjectiveCreateRequest skillObjectiveCreateOrUpdateRequest);

    @Mapping(target = "createdOn", ignore = true)
    @Mapping(target = "updatedOn", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "employee", ignore = true)
    @Mapping(target = "skill", ignore = true)
    @Mapping(target = "currentSkillLevel", ignore = true)
    void mapToSkillObjective(@MappingTarget SkillObjective skillObjective, SkillObjectiveUpdateRequest skillObjectiveCreateOrUpdateRequest);

}