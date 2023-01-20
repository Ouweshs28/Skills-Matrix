package com.skillsmatrix.service.impl;

import com.skillsmatrix.dto.EmployeeSkillResponse;
import com.skillsmatrix.dto.SkillCreateOrUpdateRequest;
import com.skillsmatrix.dto.SkillResponse;
import com.skillsmatrix.exception.ResourceNotFoundException;
import com.skillsmatrix.mapper.EmployeeSkillMapper;
import com.skillsmatrix.mapper.SkillMapper;
import com.skillsmatrix.persistence.entity.EmployeeDomain;
import com.skillsmatrix.persistence.entity.QEmployeeSkill;
import com.skillsmatrix.persistence.entity.QSkill;
import com.skillsmatrix.persistence.entity.Skill;
import com.skillsmatrix.persistence.entity.SkillCategory;
import com.skillsmatrix.persistence.repository.EmployeeDomainRepository;
import com.skillsmatrix.persistence.repository.EmployeeSkillRepository;
import com.skillsmatrix.persistence.repository.SkillCategoryRepository;
import com.skillsmatrix.persistence.repository.SkillRepository;
import com.skillsmatrix.service.AuthorizationService;
import com.skillsmatrix.service.SkillService;
import com.querydsl.core.BooleanBuilder;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Locale;
import java.util.Objects;

/**
 * @author zaf
 */
@Service
@RequiredArgsConstructor
public class SkillServiceImpl implements SkillService {

    private final AuthorizationService authorizationService;
    private final EmployeeDomainRepository employeeDomainRepository;
    private final EmployeeSkillRepository employeeSkillRepository;
    private final SkillRepository skillRepository;
    private final SkillCategoryRepository skillCategoryRepository;
    private final EmployeeSkillMapper employeeSkillMapper;
    private final SkillMapper skillMapper;

    @Override
    public Page<EmployeeSkillResponse> findEmployeeSkills(String skillName, PageRequest pageRequest) {
        Long employeeId = authorizationService.getUserId();
        return findEmployeeSkills(employeeId, skillName, pageRequest);
    }

    @Override
    public Page<EmployeeSkillResponse> findEmployeeSkills(Long employeeId, String skillName, PageRequest pageRequest) {
        BooleanBuilder employeePredicate = new BooleanBuilder();
        if (Objects.nonNull(skillName)) {
            employeePredicate.and(QEmployeeSkill.employeeSkill.skill.name.containsIgnoreCase(skillName));
        }
        employeePredicate.and(QEmployeeSkill.employeeSkill.employee.id.eq(employeeId));
        return employeeSkillRepository.findAll(employeePredicate, pageRequest)
                .map(employeeSkillMapper::mapToEmployeeSkillResponse);
    }

    @Override
    public void createSkill(SkillCreateOrUpdateRequest skillCreateOrUpdateRequest) {
        Skill skill = skillMapper.mapToSkillEntity(skillCreateOrUpdateRequest);
        EmployeeDomain employeeDomain = employeeDomainRepository.findById(skillCreateOrUpdateRequest.getEmployeeDomainId())
                .orElseThrow(() -> new ResourceNotFoundException("Employee domain not found!"));
        SkillCategory skillCategory = skillCategoryRepository.findById(skillCreateOrUpdateRequest.getSkillCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Skill category not found!"));
        skill.setEmployeeDomain(employeeDomain);
        skill.setSkillCategory(skillCategory);
        skillRepository.save(skill);
    }

    @Override
    public SkillResponse findSkillById(Long skillId) {
        return skillRepository
                .findById(skillId)
                .map(skillMapper::mapToSkillResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Skill not found!"));
    }

    @Override
    public Page<SkillResponse> searchSkills(String keyword, PageRequest pageRequest) {
        BooleanBuilder predicate = buildSearchSkillPredicate(keyword, null);
        return skillRepository.findAll(predicate, pageRequest)
                .map(skillMapper::mapToSkillResponse);
    }

    @Override
    public Page<SkillResponse> searchSkills(String keyword, List<Long> existingSkill, PageRequest pageRequest) {
        BooleanBuilder predicate = buildSearchSkillPredicate(keyword, existingSkill);
        return skillRepository.findAll(predicate, pageRequest)
                .map(skillMapper::mapToSkillResponse);
    }

    @Override
    public void updateSkill(Long skillId, SkillCreateOrUpdateRequest skillCreateOrUpdateRequest) {
        EmployeeDomain employeeDomain = employeeDomainRepository.findById(skillCreateOrUpdateRequest.getEmployeeDomainId())
                .orElseThrow(() -> new ResourceNotFoundException("Invalid employee domain entered!"));

        SkillCategory skillCategory = skillCategoryRepository.findById(skillCreateOrUpdateRequest.getSkillCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Invalid skill category entered!"));

        skillRepository.findById(skillId)
                .ifPresentOrElse(skill -> {
                    skillMapper.mapToSkillEntity(skill, skillCreateOrUpdateRequest);
                    skill.setEmployeeDomain(employeeDomain);
                    skill.setSkillCategory(skillCategory);
                    skillRepository.save(skill);
                }, () -> {
                    throw new ResourceNotFoundException("Invalid skill entered for update!");
                });
    }

    @Override
    public void archiveSkill(Long skillId) {
        skillRepository.findById(skillId)
                .ifPresentOrElse(skill -> {
                    skill.setArchived(true);
                    skillRepository.save(skill);
                }, () -> {
                    throw new ResourceNotFoundException("Invalid skill id entered!");
                });
    }

    private BooleanBuilder buildSearchSkillPredicate(String keyword, List<Long> existingSkill) {
        var qSkill = QSkill.skill;
        BooleanBuilder booleanBuilder = new BooleanBuilder();

        if (Objects.nonNull(keyword)) {
            booleanBuilder.or(qSkill.name.toLowerCase().contains(keyword.toLowerCase(Locale.ROOT)));
            booleanBuilder.or(qSkill.description.toLowerCase().contains(keyword.toLowerCase(Locale.ROOT)));
            booleanBuilder.or(qSkill.skillCategory.name.toLowerCase().contains(keyword.toLowerCase(Locale.ROOT)));
            booleanBuilder.or(qSkill.employeeDomain.name.toLowerCase().contains(keyword.toLowerCase(Locale.ROOT)));
        }
        if (Objects.nonNull(existingSkill)) {
            booleanBuilder.and(qSkill.id.notIn(existingSkill));
        }
        booleanBuilder.and(qSkill.archived.eq(false));
        return booleanBuilder;
    }

}
