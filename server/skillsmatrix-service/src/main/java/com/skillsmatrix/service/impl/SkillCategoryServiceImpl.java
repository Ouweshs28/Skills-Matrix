package com.skillsmatrix.service.impl;

import com.skillsmatrix.dto.SkillCategoryCreateOrUpdateRequest;
import com.skillsmatrix.dto.SkillCategoryResponse;
import com.skillsmatrix.exception.ResourceNotFoundException;
import com.skillsmatrix.mapper.SkillCategoryMapper;
import com.skillsmatrix.persistence.entity.QSkillCategory;
import com.skillsmatrix.persistence.entity.SkillCategory;
import com.skillsmatrix.persistence.repository.SkillCategoryRepository;
import com.skillsmatrix.service.SkillCategoryService;
import com.querydsl.core.BooleanBuilder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.Locale;
import java.util.Objects;

/**
 * @author zaf
 */
@Service
public class SkillCategoryServiceImpl implements SkillCategoryService {

    private final SkillCategoryRepository skillCategoryRepository;
    private final SkillCategoryMapper skillCategoryMapper;

    public SkillCategoryServiceImpl(SkillCategoryRepository skillCategoryRepository, SkillCategoryMapper skillCategoryMapper) {
        this.skillCategoryRepository = skillCategoryRepository;
        this.skillCategoryMapper = skillCategoryMapper;
    }

    @Override
    public void createSkillCategory(SkillCategoryCreateOrUpdateRequest skillCategoryCreateOrUpdateRequest) {
        SkillCategory skillCategory = skillCategoryMapper.mapToSkillCategoryEntity(skillCategoryCreateOrUpdateRequest);
        skillCategoryRepository.save(skillCategory);
    }

    @Override
    public SkillCategoryResponse findSkillCategoryById(Long skillCategoryId) {
        return skillCategoryMapper.mapToSkillCategoryResponse(skillCategoryRepository.findById(skillCategoryId).orElseThrow(() -> new ResourceNotFoundException("Invalid Skill Category!")));
    }

    @Override
    public Page<SkillCategoryResponse> searchSkillCategory(String keyword, PageRequest pageRequest) {
        BooleanBuilder predicate = buildSearchSkillCategoryPredicate(keyword);
        return skillCategoryRepository.findAll(predicate, pageRequest).map(skillCategoryMapper::mapToSkillCategoryResponse);
    }

    @Override
    public void updateSkillCategory(Long skillCategoryId, SkillCategoryCreateOrUpdateRequest skillCategoryCreateOrUpdateRequest) {
        skillCategoryRepository.findById(skillCategoryId).ifPresentOrElse(skillCategory -> {
            skillCategory.setName(skillCategoryCreateOrUpdateRequest.getName());
            skillCategory.setDescription(skillCategoryCreateOrUpdateRequest.getDescription());
            skillCategoryRepository.save(skillCategory);
        }, () -> {
            throw new ResourceNotFoundException("Invalid skill category id entered!");
        });
    }

    @Override
    public void archiveSkillCategory(Long skillCategoryId) {
        skillCategoryRepository.findById(skillCategoryId)
                .ifPresentOrElse(skillCategory -> {
                    skillCategory.setArchived(true);
                    skillCategoryRepository.save(skillCategory);
                }, () -> {
                    throw new ResourceNotFoundException("Invalid skill category id entered!");
                });
    }

    private BooleanBuilder buildSearchSkillCategoryPredicate(String keyword) {
        var qSkillCategory = QSkillCategory.skillCategory;
        BooleanBuilder booleanBuilder = new BooleanBuilder();
        if (Objects.nonNull(keyword)) {
            booleanBuilder.or(qSkillCategory.name.toLowerCase().contains(keyword.toLowerCase(Locale.ROOT)));
            booleanBuilder.or(qSkillCategory.description.toLowerCase().contains(keyword.toLowerCase(Locale.ROOT)));
        }
        booleanBuilder.and(qSkillCategory.archived.eq(false));
        return booleanBuilder;
    }

}
