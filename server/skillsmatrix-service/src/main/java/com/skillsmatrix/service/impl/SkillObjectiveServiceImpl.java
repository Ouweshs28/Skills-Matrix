package com.skillsmatrix.service.impl;

import com.skillsmatrix.dto.SkillObjectiveCreateRequest;
import com.skillsmatrix.dto.SkillObjectiveResponse;
import com.skillsmatrix.dto.SkillObjectiveSearchCriteria;
import com.skillsmatrix.dto.SkillObjectiveUpdateRequest;
import com.skillsmatrix.exception.ResourceNotFoundException;
import com.skillsmatrix.mapper.SkillObjectiveMapper;
import com.skillsmatrix.persistence.entity.Employee;
import com.skillsmatrix.persistence.entity.EmployeeSkill;
import com.skillsmatrix.persistence.entity.Skill;
import com.skillsmatrix.persistence.entity.SkillObjective;
import com.skillsmatrix.persistence.repository.EmployeeRepository;
import com.skillsmatrix.persistence.repository.EmployeeSkillRepository;
import com.skillsmatrix.persistence.repository.SkillObjectiveRepository;
import com.skillsmatrix.persistence.repository.SkillRepository;
import com.skillsmatrix.service.AuthorizationService;
import com.skillsmatrix.service.SkillObjectiveService;
import com.querydsl.core.BooleanBuilder;
import com.skillsmatrix.enumeration.Role;
import com.skillsmatrix.persistence.enumeration.SkillObjectiveStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import javax.annotation.security.RolesAllowed;
import java.time.LocalDate;
import java.util.Objects;

import static com.skillsmatrix.persistence.entity.QSkillObjective.skillObjective;

@Service
@RequiredArgsConstructor
public class SkillObjectiveServiceImpl implements SkillObjectiveService {

    private final AuthorizationService authorizationService;
    private final EmployeeRepository employeeRepository;
    private final EmployeeSkillRepository employeeSkillRepository;
    private final SkillRepository skillRepository;
    private final SkillObjectiveRepository skillObjectiveRepository;
    private final SkillObjectiveMapper skillObjectiveMapper;

    @Override
    @RolesAllowed({Role.ROLE_MANAGER})
    public void createSkillObjective(Long employeeId, SkillObjectiveCreateRequest skillObjectiveCreateOrUpdateRequest) {
        authorizationService.verifyIfManagerHasAccess(employeeId);

        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee id " + employeeId + " does not exist!"));

        Skill skill = skillRepository.findById(skillObjectiveCreateOrUpdateRequest.getSkillId())
                .orElseThrow(() -> new ResourceNotFoundException("Skill id " + skillObjectiveCreateOrUpdateRequest.getSkillId() + " does not exist!"));

        EmployeeSkill employeeSkill = employeeSkillRepository.findEmployeeSkillByEmployeeAndSkill(employee, skill)
                .orElseThrow(() -> new ResourceNotFoundException("employee does not have that skill " + skillObjectiveCreateOrUpdateRequest.getSkillId() + " does not exist!"));

        SkillObjective skillObjective = skillObjectiveMapper.mapToSkillObjective(skillObjectiveCreateOrUpdateRequest);
        skillObjective.setEmployee(employee);
        skillObjective.setSkill(skill);
        skillObjective.setCurrentSkillLevel(employeeSkill.getSkillLevel());
        SkillObjective savedSkillObjective = skillObjectiveRepository.saveAndFlush(skillObjective);
        employeeSkill.setCurrentObjective(savedSkillObjective);
        employeeSkillRepository.save(employeeSkill);
    }

    @Override
    public SkillObjectiveResponse findById(Long employeeId, Long skillObjectiveId) {
        authorizationService.verifyIfManagerHasAccess(employeeId);
        return skillObjectiveRepository.findById(skillObjectiveId).map(skillObjectiveMapper::mapToSkillObjectiveResponse)
                .orElseThrow(() -> new ResourceNotFoundException("skillObjective " + skillObjectiveId + " does not exist!"));
    }

    @Override
    public Page<SkillObjectiveResponse> searchObjectives(SkillObjectiveSearchCriteria searchCriteria, PageRequest pageRequest) {
        return findObjectives(authorizationService.getUserId(), searchCriteria, pageRequest);
    }

    @Override
    @RolesAllowed({Role.ROLE_MANAGER})
    public Page<SkillObjectiveResponse> searchObjectives(Long employeeId, SkillObjectiveSearchCriteria searchCriteria, PageRequest pageRequest) {
        authorizationService.verifyIfManagerHasAccess(employeeId);
        return findObjectives(employeeId, searchCriteria, pageRequest);
    }

    @Override
    @RolesAllowed({Role.ROLE_MANAGER})
    public Page<SkillObjectiveResponse> searchAllObjectives(LocalDate dateFrom, PageRequest pageRequest) {
        BooleanBuilder predicate = new BooleanBuilder();
        predicate.and(skillObjective.employee.manager.id.eq(authorizationService.getUserId())
                .and(skillObjective.status.eq(SkillObjectiveStatus.NEW)));
        if (Objects.nonNull(dateFrom)) {
            predicate.and(skillObjective.targetDate.after(dateFrom));
        }
        return skillObjectiveRepository.findAll(predicate, pageRequest)
                .map(skillObjectiveMapper::mapToSkillObjectiveResponse);
    }

    @Override
    @RolesAllowed({Role.ROLE_MANAGER})
    public void updateSkillObjective(Long employeeId, Long skillObjectiveId, SkillObjectiveUpdateRequest skillObjectiveUpdateRequest) {
        authorizationService.verifyIfManagerHasAccess(employeeId);

        SkillObjective toUpdate = skillObjectiveRepository.findById(skillObjectiveId)
                .orElseThrow(() -> new ResourceNotFoundException("SkillObjective id " + skillObjectiveId + " does not exist!"));

        skillObjectiveMapper.mapToSkillObjective(toUpdate, skillObjectiveUpdateRequest);
        skillObjectiveRepository.save(toUpdate);
        EmployeeSkill employeeSkill = employeeSkillRepository.findEmployeeSkillByEmployeeAndSkill(toUpdate.getEmployee(), toUpdate.getSkill())
                .orElseThrow(() -> new ResourceNotFoundException("employee does not have that skill " + toUpdate.getSkill().getId() + " does not exist!"));
        if (!toUpdate.getStatus().equals(SkillObjectiveStatus.NEW)) {
            employeeSkill.setCurrentObjective(null);

        }
        if (toUpdate.getStatus().equals(SkillObjectiveStatus.COMPLETE)) {
            employeeSkill.setSkillLevel(toUpdate.getTargetSkillLevel());
        }
        employeeSkillRepository.save(employeeSkill);
    }

    private Page<SkillObjectiveResponse> findObjectives(Long employeeId, SkillObjectiveSearchCriteria searchCriteria, PageRequest pageRequest) {
        BooleanBuilder predicate = new BooleanBuilder();
        predicate.and(skillObjective.employee.id.eq(employeeId));

        if (Objects.nonNull(searchCriteria.getCurrentSkillLevel())) {
            predicate.and(skillObjective.currentSkillLevel.eq(searchCriteria.getCurrentSkillLevel()));
        }

        if (Objects.nonNull(searchCriteria.getSkillId())) {
            predicate.and(skillObjective.skill.id.eq(searchCriteria.getSkillId()));
        }

        if (Objects.nonNull(searchCriteria.getStatus())) {
            predicate.and(skillObjective.status.eq(searchCriteria.getStatus()));
        }

        if (Objects.nonNull(searchCriteria.getDateFrom())) {
            predicate.and(skillObjective.targetDate.after(searchCriteria.getDateFrom()));
        }

        return skillObjectiveRepository.findAll(predicate, pageRequest)
                .map(skillObjectiveMapper::mapToSkillObjectiveResponse);
    }
}
