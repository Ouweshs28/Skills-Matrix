package com.skillsmatrix.service;

import com.skillsmatrix.dto.SkillCategoryCreateOrUpdateRequest;
import com.skillsmatrix.dto.SkillCategoryResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

/**
 * @author zaf
 */
public interface SkillCategoryService {

    Page<SkillCategoryResponse> searchSkillCategory(String keyword, PageRequest pageRequest);

    SkillCategoryResponse findSkillCategoryById(Long skillCategoryId);

    void createSkillCategory(SkillCategoryCreateOrUpdateRequest skillCategoryCreateOrUpdateRequest);

    void updateSkillCategory(Long skillCategoryId, SkillCategoryCreateOrUpdateRequest skillCategoryCreateOrUpdateRequest);

    void archiveSkillCategory(Long skillCategoryId);

}
