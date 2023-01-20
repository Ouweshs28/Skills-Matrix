package com.skillsmatrix.mapper;

import com.skillsmatrix.dto.SkillCategoryCreateOrUpdateRequest;
import com.skillsmatrix.dto.SkillCategoryResponse;
import com.skillsmatrix.persistence.entity.SkillCategory;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

/**
 * @author zaf
 */
@Mapper(componentModel = "spring")
public interface SkillCategoryMapper {

    @Mapping(target = "createdOn", ignore = true)
    @Mapping(target = "updatedOn", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "archived", defaultValue = "false")
    SkillCategory mapToSkillCategoryEntity(SkillCategoryCreateOrUpdateRequest skillCategoryCreateOrUpdateRequest);

    SkillCategoryResponse mapToSkillCategoryResponse(SkillCategory skillCategory);

}