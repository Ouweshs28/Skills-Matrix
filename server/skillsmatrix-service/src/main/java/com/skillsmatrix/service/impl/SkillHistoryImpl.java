package com.skillsmatrix.service.impl;

import com.skillsmatrix.dto.EmployeeResponse;
import com.skillsmatrix.dto.SkillHistoryCreateRequest;
import com.skillsmatrix.dto.SkillHistoryResponse;
import com.skillsmatrix.dto.SkillHistoryReviewUpdateRequest;
import com.skillsmatrix.dto.SkillHistorySearchCriteria;
import com.skillsmatrix.dto.SkillHistoryUpdateRequest;
import com.skillsmatrix.exception.BadRequestException;
import com.skillsmatrix.exception.DataDuplicationException;
import com.skillsmatrix.exception.ResourceNotFoundException;
import com.skillsmatrix.mapper.EmployeeMapper;
import com.skillsmatrix.mapper.SkillHistoryMapper;
import com.skillsmatrix.persistence.entity.Employee;
import com.skillsmatrix.persistence.entity.EmployeeSkill;
import com.skillsmatrix.persistence.entity.Skill;
import com.skillsmatrix.persistence.entity.SkillHistory;
import com.skillsmatrix.persistence.enumeration.SkillLevel;
import com.skillsmatrix.persistence.enumeration.SkillStatus;
import com.skillsmatrix.persistence.repository.EmployeeRepository;
import com.skillsmatrix.persistence.repository.EmployeeSkillRepository;
import com.skillsmatrix.persistence.repository.NotificationRepository;
import com.skillsmatrix.persistence.repository.SkillHistoryRepository;
import com.skillsmatrix.persistence.repository.SkillRepository;
import com.skillsmatrix.service.AuthorizationService;
import com.skillsmatrix.service.NotificationService;
import com.skillsmatrix.service.SkillHistoryService;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.Predicate;
import com.skillsmatrix.enumeration.Role;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import javax.annotation.security.RolesAllowed;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static com.skillsmatrix.persistence.entity.QSkillHistory.skillHistory;

/*
 * @author zaf
 */
@Service
@RequiredArgsConstructor
public class SkillHistoryImpl implements SkillHistoryService {

    private final AuthorizationService authorizationService;
    private final SkillRepository skillRepository;
    private final EmployeeRepository employeeRepository;
    private final SkillHistoryRepository skillHistoryRepository;
    private final EmployeeSkillRepository employeeSkillRepository;
    private final NotificationRepository notificationRepository;
    private final SkillHistoryMapper skillHistoryMapper;
    private final EmployeeMapper employeeMapper;
    private final NotificationService notificationService;

    @Override
    public void createSkillHistory(SkillHistoryCreateRequest skillHistoryCreateRequest) {
        Long employeeId = authorizationService.getUserId();

        Skill skill = skillRepository.findById(skillHistoryCreateRequest.getSkillId())
                .orElseThrow(() -> new ResourceNotFoundException("Skill id " + skillHistoryCreateRequest.getSkillId() + " does not exist!"));

        SkillHistory skillHistory = skillHistoryMapper.mapToSkillHistoryEntity(skillHistoryCreateRequest);

        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee id " + employeeId + " does not exist!"));

        employeeSelfAssessmentCheck(employeeId, skillHistoryCreateRequest, skill);
        skillHistory.setEmployee(employee);
        skillHistory.setReviewer(employee);
        skillHistory.setSkill(skill);
        skillHistoryRepository.save(skillHistory);
        notificationService.addNotificationManager(employee);
    }

    @Override
    public Page<SkillHistoryResponse> searchSkillHistory(SkillHistorySearchCriteria searchCriteria, PageRequest pageRequest) {
        Long employeeId = authorizationService.getUserId();
        return findSkillHistory(employeeId, searchCriteria, pageRequest);
    }

    @Override
    public Page<SkillHistoryResponse> searchSkillHistory(Long employeeId, SkillHistorySearchCriteria searchCriteria, PageRequest pageRequest) {
        return findSkillHistory(employeeId, searchCriteria, pageRequest);
    }

    @Override
    @RolesAllowed({Role.ROLE_MANAGER})
    public List<EmployeeResponse> findAssignedReviewersByEmployeeId(Long employeeId) {
        authorizationService.verifyIfManagerHasAccess(employeeId);
        return employeeRepository
                .findAssignedReviewersByEmployeeId(employeeId, SkillStatus.PENDING)
                .stream()
                .map(employeeMapper::mapToEmployeeResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<EmployeeResponse> findEmployeesToReview(String keyword) {
        Long reviewerId = authorizationService.getUserId();
        return employeeRepository
                .findEmployeesToReview(reviewerId, keyword, SkillStatus.PENDING)
                .stream()
                .map(employeeMapper::mapToEmployeeResponse)
                .collect(Collectors.toList());
    }

    @Override
    @RolesAllowed({Role.ROLE_MANAGER})
    public Page<SkillHistoryResponse> findSkillHistoryByReviewerId(Long employeeId, Long reviewerId, PageRequest pageRequest) {
        authorizationService.verifyIfManagerHasAccess(employeeId);

        BooleanBuilder booleanBuilderPredicate = new BooleanBuilder();
        booleanBuilderPredicate.and(skillHistory.employee.id.eq(employeeId))
                .and(skillHistory.reviewer.id.eq(reviewerId))
                .and(skillHistory.status.eq(SkillStatus.PENDING));

        return skillHistoryRepository.findAll(booleanBuilderPredicate, pageRequest)
                .map(skillHistoryMapper::mapToSkillHistoryResponse);
    }

    @Override
    public Page<SkillHistoryResponse> findSkillHistoryByEmployeeId(Long employeeId, PageRequest pageRequest) {
        authorizationService.verifyIfReviewerHasAccess(employeeId);
        BooleanBuilder booleanBuilderPredicate = new BooleanBuilder();
        booleanBuilderPredicate.and(skillHistory.employee.id.eq(employeeId))
                .and(skillHistory.reviewer.id.eq(authorizationService.getUserId()))
                .and(skillHistory.status.eq(SkillStatus.PENDING));

        return skillHistoryRepository.findAll(booleanBuilderPredicate, pageRequest)
                .map(skillHistoryMapper::mapToSkillHistoryResponse);

    }

    @Override
    public void updateSkillHistory(Long skillHistoryId, SkillHistoryUpdateRequest skillHistoryUpdateRequest) {
        Long employeeId = authorizationService.getUserId();

        SkillHistory skillHistory = skillHistoryRepository.findById(skillHistoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Invalid skill history record entered for update!"));

        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Invalid employee entered!"));

        Skill skill = skillHistory.getSkill();
        if (skillHistory.getEmployee().getId() == (employeeId)) {
            verifyExistingSkillHistoryWithSameSkillAndLevel(skillHistoryUpdateRequest, skillHistory);
        }
        if (skillHistory.getReviewer().getId() == employeeId) {
            checkExistingApprovedSkillWithSameOrLowerLevel(employeeId, skill.getId(), skillHistoryUpdateRequest.getSkillLevel(), skill);
            checkExistingDeclinedSkillWithSameLevel(employeeId, skill.getId(), skillHistoryUpdateRequest.getSkillLevel(), skill);
        }
        skillHistory.setSkillLevel(skillHistoryUpdateRequest.getSkillLevel());
        skillHistory.setComments(skillHistoryUpdateRequest.getComments());
        skillHistoryRepository.save(skillHistory);
    }

    @Override
    @RolesAllowed({Role.ROLE_MANAGER})
    public void updateSkillHistory(Long employeeId, Long skillHistoryId, SkillHistoryReviewUpdateRequest skillHistoryReviewUpdateRequest) {
        authorizationService.verifyIfManagerHasAccess(employeeId);

        SkillHistory skillHistoryEntity = skillHistoryRepository.findById(skillHistoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Invalid skill history entered!"));

        BooleanBuilder predicate = new BooleanBuilder();
        predicate.and(skillHistory.employee.id.eq(employeeId))
                .and(skillHistory.skill.id.eq(skillHistoryEntity.getSkill().getId()))
                .and(skillHistory.status.eq(SkillStatus.PENDING));

        skillHistoryRepository
                .findAll(predicate)
                .forEach(sh -> {
                            sh.setComments(skillHistoryReviewUpdateRequest.getComments());
                            sh.setStatus(skillHistoryReviewUpdateRequest.getStatus());
                            skillHistoryRepository.save(sh);
                        }
                );

        if (skillHistoryReviewUpdateRequest.getStatus() != SkillStatus.APPROVED) {
            return;
        }

        employeeSkillRepository.findEmployeeSkillByEmployeeAndSkill(skillHistoryEntity.getEmployee(), skillHistoryEntity.getSkill())
                .ifPresentOrElse(employeeSkill -> {
                    employeeSkill.setSkillLevel(skillHistoryEntity.getSkillLevel());
                    employeeSkillRepository.save(employeeSkill);
                }, () -> {
                    EmployeeSkill employeeSkill = new EmployeeSkill();
                    employeeSkill.setEmployee(skillHistoryEntity.getEmployee());
                    employeeSkill.setSkill(skillHistoryEntity.getSkill());
                    employeeSkill.setSkillLevel(skillHistoryEntity.getSkillLevel());
                    employeeSkillRepository.save(employeeSkill);
                });
    }

    @Override
    @RolesAllowed({Role.ROLE_MANAGER})
    public void assignReviewer(Long employeeId, List<Long> reviewers) {
        authorizationService.verifyIfManagerHasAccess(employeeId);
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee id " + employeeId + " does not exist!"));

        Predicate skillHistoryPredicate = skillHistory.employee.id.eq(employeeId)
                .and(skillHistory.reviewer.id.eq(employeeId))
                .and(skillHistory.status.eq(SkillStatus.PENDING));
        Iterable<SkillHistory> skillHistories = skillHistoryRepository.findAll(skillHistoryPredicate);

        reviewers.forEach(reviewer -> {
                    StreamSupport
                            .stream(skillHistories.spliterator(), false)
                            .filter(sh -> !checkIfReviewExist(employeeId, reviewer, sh.getSkill().getId()))
                            .map(sh -> {
                                Employee reviewerEntity = employeeRepository.findById(reviewer)
                                        .orElseThrow(() -> new ResourceNotFoundException("Employee id " + employeeId + " does not exist!"));
                                return SkillHistory
                                        .builder()
                                        .employee(employee)
                                        .skill(sh.getSkill())
                                        .status(SkillStatus.PENDING)
                                        .reviewer(reviewerEntity)
                                        .comments("To be reviewed")
                                        .build();
                            })
                            .forEach(skillHistoryRepository::save);
                    String employeeName = employee.getFirstName().concat(" ").concat(employee.getLastName());
                    String managerName = employee.getManager().getFirstName().concat(" ").concat(employee.getManager().getLastName());
                    Employee reviewerData = employeeRepository.findById(reviewer)
                            .orElseThrow(() -> new ResourceNotFoundException("Employee id " + employeeId + " does not exist!"));
                    notificationService.addNotificationReviewer(employeeName, reviewerData.getVisa(), reviewerData.getEmail(), managerName);
                }
        );
    }

    @Override
    public void deleteSkillHistory(Long skillHistoryId) {
        SkillHistory skillHistoryEntity = skillHistoryRepository.findById(skillHistoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Invalid skill record entered for update!"));

        if (skillHistoryEntity.getStatus().equals(SkillStatus.DECLINED)) {
            skillHistoryRepository.delete(skillHistoryEntity);
        } else if (skillHistoryEntity.getStatus().equals(SkillStatus.PENDING)) {
            BooleanBuilder predicate = new BooleanBuilder();
            predicate.and(skillHistory.employee.id.eq(authorizationService.getUserId()))
                    .and(skillHistory.skill.id.eq(skillHistoryEntity.getSkill().getId()))
                    .and(skillHistory.status.eq(SkillStatus.PENDING));
            skillHistoryRepository.findAll(predicate)
                    .forEach(skillHistoryRepository::delete);
        } else {
            throw new BadRequestException("You cannot delete once it's been " + skillHistoryEntity.getStatus() + " !");
        }
    }

    private void employeeSelfAssessmentCheck(Long employeeId, SkillHistoryCreateRequest skillHistoryCreateRequest, Skill skill) {
        Predicate checkExistingPendingSkill = skillHistory.employee.id.eq(employeeId)
                .and(skillHistory.reviewer.id.eq(employeeId))
                .and(skillHistory.skill.id.eq(skillHistoryCreateRequest.getSkillId()))
                .and(skillHistory.status.eq(SkillStatus.PENDING));
        if (skillHistoryRepository.exists(checkExistingPendingSkill)) {
            throw new DataDuplicationException("Skill " + skill.getName() + " is already in review!");
        }
        checkExistingApprovedSkillWithSameOrLowerLevel(employeeId, skillHistoryCreateRequest.getSkillId(), skillHistoryCreateRequest.getSkillLevel(), skill);
        checkExistingDeclinedSkillWithSameLevel(employeeId, skillHistoryCreateRequest.getSkillId(), skillHistoryCreateRequest.getSkillLevel(), skill);
    }

    private void checkExistingApprovedSkillWithSameOrLowerLevel(Long employeeId, Long skillId, SkillLevel skillLevel, Skill skill) {
        BooleanBuilder booleanBuilderPredicate = new BooleanBuilder();
        booleanBuilderPredicate.and(skillHistory.employee.id.eq(employeeId))
                .and(skillHistory.reviewer.id.eq(employeeId))
                .and(skillHistory.skill.id.eq(skillId))
                .and((skillHistory.skillLevel.eq(skillLevel))
                        .or(skillHistory.skillLevel.gt(skillLevel)))
                .and(skillHistory.status.eq(SkillStatus.APPROVED));
        skillHistoryRepository.findOne(booleanBuilderPredicate)
                .ifPresent(skillHistory -> {
                    throw new DataDuplicationException("You already have an approved skill of " + skill.getName() + " with level "
                            + skillHistory.getSkillLevel().toString() + "! Try using a greater skill level");
                });
    }

    private void checkExistingDeclinedSkillWithSameLevel(Long employeeId, Long skillId, SkillLevel skillLevel, Skill skill) {
        BooleanBuilder booleanBuilderPredicate = new BooleanBuilder();
        booleanBuilderPredicate.and(skillHistory.employee.id.eq(employeeId)
                .and(skillHistory.reviewer.id.eq(employeeId))
                .and(skillHistory.skill.id.eq(skillId))
                .and(skillHistory.skillLevel.eq(skillLevel))
                .and(skillHistory.status.eq(SkillStatus.DECLINED))
                .and(skillHistory.createdOn.after(LocalDateTime.now().minusMonths(6L))));
        if (skillHistoryRepository.exists(booleanBuilderPredicate)) {
            throw new DataDuplicationException("You already have " + skill.getName() + " with level " + skillLevel
                    + " declined.");
        }
    }

    private void verifyExistingSkillHistoryWithSameSkillAndLevel(SkillHistoryUpdateRequest skillHistoryUpdateRequest, SkillHistory skillHistoryEntity) {
        BooleanBuilder booleanBuilderPredicate = new BooleanBuilder();
        booleanBuilderPredicate.and(skillHistory.skill.id.eq(skillHistoryEntity.getSkill().getId()))
                .and(skillHistory.skillLevel.eq(skillHistoryUpdateRequest.getSkillLevel()));
        if (skillHistoryRepository.exists(booleanBuilderPredicate)) {
            throw new DataDuplicationException("No changes have been made!");
        }
    }

    private boolean checkIfReviewExist(Long employeeId, Long reviewerId, Long skillId) {
        Predicate skillHistoryPredicate = skillHistory.employee.id.eq(employeeId).
                and(skillHistory.status.eq(SkillStatus.PENDING))
                .and(skillHistory.reviewer.id.eq(reviewerId)).
                and(skillHistory.skill.id.eq(skillId));
        Optional<SkillHistory> result = skillHistoryRepository.findOne(skillHistoryPredicate);
        return result.isPresent();
    }

    private Page<SkillHistoryResponse> findSkillHistory(Long employeeId, SkillHistorySearchCriteria searchCriteria, PageRequest pageRequest) {
        BooleanBuilder booleanBuilderPredicate = new BooleanBuilder();

        if (Objects.nonNull(searchCriteria.getKeyword())) {
            booleanBuilderPredicate.or(skillHistory.skill.name.containsIgnoreCase(searchCriteria.getKeyword()));
            booleanBuilderPredicate.or(skillHistory.skillLevel.stringValue().containsIgnoreCase(searchCriteria.getKeyword()));
        }

        if (Objects.nonNull(searchCriteria.getSkillId())) {
            booleanBuilderPredicate.and(skillHistory.skill.id.eq(searchCriteria.getSkillId()));
        }

        if (Objects.nonNull(searchCriteria.getSkillStatus())) {
            booleanBuilderPredicate.and(skillHistory.status.eq(searchCriteria.getSkillStatus()));
        }

        booleanBuilderPredicate.and(skillHistory.employee.id.eq(employeeId))
                .and(skillHistory.reviewer.id.eq(employeeId));

        return skillHistoryRepository.findAll(booleanBuilderPredicate, pageRequest)
                .map(skillHistoryMapper::mapToSkillHistoryResponse);
    }

}
