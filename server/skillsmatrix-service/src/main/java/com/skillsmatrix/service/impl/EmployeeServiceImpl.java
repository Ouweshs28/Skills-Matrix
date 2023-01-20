package com.skillsmatrix.service.impl;

import com.skillsmatrix.dto.EmployeeCreateOrUpdateRequest;
import com.skillsmatrix.dto.EmployeeResponse;
import com.skillsmatrix.dto.ManagerResponse;
import com.skillsmatrix.dto.SearchEmployeeCriteria;
import com.skillsmatrix.exception.ResourceNotFoundException;
import com.skillsmatrix.mapper.EmployeeMapper;
import com.skillsmatrix.persistence.entity.Employee;
import com.skillsmatrix.persistence.entity.EmployeeSkill;
import com.skillsmatrix.persistence.entity.QEmployee;
import com.skillsmatrix.persistence.entity.QEmployeeSkill;
import com.skillsmatrix.persistence.enumeration.SkillLevel;
import com.skillsmatrix.persistence.repository.EmployeeDomainRepository;
import com.skillsmatrix.persistence.repository.EmployeeRepository;
import com.skillsmatrix.service.AuthorizationService;
import com.skillsmatrix.service.EmployeeService;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.dsl.ListPath;
import com.skillsmatrix.enumeration.Role;
import com.skillsmatrix.persistence.enumeration.EmploymentPosition;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import javax.annotation.security.RolesAllowed;
import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

import static com.skillsmatrix.persistence.entity.QEmployee.employee;

@Service
@RequiredArgsConstructor
public class EmployeeServiceImpl implements EmployeeService {

    private final AuthorizationService authorizationService;
    private final EmployeeRepository employeeRepository;
    private final EmployeeDomainRepository employeeDomainRepository;
    private final EmployeeMapper employeeMapper;

    @Override
    @RolesAllowed({Role.ROLE_ADMINISTRATOR})
    public void createEmployee(EmployeeCreateOrUpdateRequest employeeCreateOrUpdateRequest) {
        Employee employee = employeeMapper.mapToEmployeeEntity(employeeCreateOrUpdateRequest);

        Optional.ofNullable(employeeCreateOrUpdateRequest.getManagerId())
                .flatMap(employeeRepository::findById)
                .ifPresentOrElse(employee::setManager,
                        () -> {
                            throw new ResourceNotFoundException("Invalid manager");
                        });

        employeeRepository.save(employee);
    }

    @Override
    public EmployeeResponse getCurrentUser() {
        return employeeRepository.findById(authorizationService.getUserId())
                .map(employeeMapper::mapToEmployeeResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Invalid username"));
    }

    @Override
    public Page<ManagerResponse> searchManagers(String name, PageRequest pageRequest) {
        BooleanBuilder predicate = new BooleanBuilder();

        if (Objects.nonNull(name)) {
            predicate.and(employee.firstName.concat(" ").concat(employee.lastName).containsIgnoreCase(name)).
                    or(employee.lastName.concat(" ").concat(employee.firstName).containsIgnoreCase(name));
        }

        predicate.and(
                        employee.position.eq(EmploymentPosition.MANAGEMENT_ASSOCIATE_PROJECT_MANAGER)
                                .or(employee.position.eq(EmploymentPosition.MANAGEMENT_PROJECT_MANAGER))
                                .or(employee.position.eq(EmploymentPosition.MANAGEMENT_SENIOR_MANAGER)))
                .and(employee.archived.eq(false));

        return employeeRepository.findAll(predicate, pageRequest)
                .map(employeeMapper::mapToManagerResponse);
    }

    @Override
    @RolesAllowed({Role.ROLE_ADMINISTRATOR, Role.ROLE_MANAGER})
    public Page<EmployeeResponse> searchEmployees(SearchEmployeeCriteria searchCriteria, PageRequest pageRequest) {
        BooleanBuilder predicate = booleanBuilderForEmployee(searchCriteria);
        return employeeRepository.findAll(predicate, pageRequest)
                .map(employeeMapper::mapToEmployeeResponse);
    }

    @Override
    @RolesAllowed({Role.ROLE_MANAGER})
    public Page<EmployeeResponse> searchManagedEmployees(String name, PageRequest pageRequest) {
        BooleanBuilder predicate = new BooleanBuilder();

        if (Objects.nonNull(name)) {
            predicate.and(employee.firstName.concat(" ").concat(employee.lastName).containsIgnoreCase(name)).
                    or(employee.lastName.concat(" ").concat(employee.firstName).containsIgnoreCase(name));
        }

        predicate.and(employee.manager.id.eq(authorizationService.getUserId()));
        predicate.and(employee.archived.eq(false));

        return employeeRepository.findAll(predicate, pageRequest)
                .map(employeeMapper::mapToEmployeeResponse);
    }

    @Override
    @RolesAllowed({Role.ROLE_MANAGER})
    public EmployeeResponse findEmployeeById(Long employeeId) {
        authorizationService.verifyIfManagerHasAccess(employeeId);
        return employeeRepository.findById(employeeId)
                .map(employeeMapper::mapToEmployeeResponse)
                .orElseThrow(() -> new ResourceNotFoundException("employee not found"));
    }

    @Override
    public void updateProfile(EmployeeCreateOrUpdateRequest employeeCreateOrUpdateRequest) {
        Employee employee = employeeRepository.findById(authorizationService.getUserId()).orElseThrow();
        employeeMapper.mapToEmployeeEntity(employee, employeeCreateOrUpdateRequest);

        Optional.ofNullable(employeeCreateOrUpdateRequest.getEmployeeDomainId())
                .flatMap(employeeDomainRepository::findById)
                .ifPresentOrElse(employee::setEmployeeDomain,
                        () -> employee.setEmployeeDomain(null));

        Optional.ofNullable(employeeCreateOrUpdateRequest.getManagerId())
                .flatMap(employeeRepository::findById)
                .ifPresentOrElse(employee::setManager,
                        () -> employee.setManager(null));

        employeeRepository.save(employee);
    }

    @Override
    @RolesAllowed({Role.ROLE_ADMINISTRATOR})
    public void archiveEmployee(Long employeeId) {
        employeeRepository.findById(employeeId)
                .ifPresentOrElse(
                        employee -> {
                            employee.setArchived(true);
                            employeeRepository.save(employee);
                        },
                        () -> {
                            throw new ResourceNotFoundException("No existing record found for an update!");
                        });
    }

    private BooleanBuilder booleanBuilderForEmployee(SearchEmployeeCriteria searchCriteria) {
        BooleanBuilder predicate = new BooleanBuilder();

        QEmployee qEmployee = employee;
        ListPath<EmployeeSkill, QEmployeeSkill> qEmployeeSkills = qEmployee.employeeSkills;

        if (Objects.nonNull(searchCriteria.getEmployeeName())) {
            predicate.and(qEmployee.firstName.concat(" ").concat(qEmployee.lastName).containsIgnoreCase(searchCriteria.getEmployeeName())).
                    or(qEmployee.lastName.concat(" ").concat(qEmployee.firstName).containsIgnoreCase(searchCriteria.getEmployeeName()));
        }

        if (Objects.nonNull(searchCriteria.getSkillLevel())) {
            searchCriteria.getSkillLevel().forEach((skillLevel) -> {
                List<SkillLevel> skillLevelEnumList = getLevels(skillLevel.getLevel());
                predicate.and(qEmployeeSkills.any().skill.id.eq(skillLevel.getId()).and(qEmployeeSkills.any().skillLevel.in(skillLevelEnumList)));
            });
        }

        if (Objects.nonNull(searchCriteria.getDomainList())) {
            predicate.and(qEmployee.employeeDomain.id.in(searchCriteria.getDomainList()).or(qEmployeeSkills.any().skill.employeeDomain.id.in(searchCriteria.getDomainList())));
        }
        if (Objects.nonNull(searchCriteria.getFactory())) {
            predicate.and(qEmployee.factory.eq(searchCriteria.getFactory()));
        }

        if (Objects.nonNull(searchCriteria.getEmployeeId())) {
            predicate.and(qEmployee.id.notIn(searchCriteria.getEmployeeId()));
        }

        if (Objects.nonNull(searchCriteria.getManagerId())) {
            predicate.and(qEmployee.id.ne(searchCriteria.getManagerId()));
        }

        predicate.and(qEmployee.archived.eq(false));

        return predicate;
    }

    private List<SkillLevel> getLevels(SkillLevel skillLevel) {
        switch (skillLevel.toString()) {
            case "Novice":
                return List.of(SkillLevel.values());
            case "Beginner":
                return List.of(SkillLevel.P1, SkillLevel.P2, SkillLevel.P3, SkillLevel.P4);
            case "Proficient":
                return List.of(SkillLevel.P2, SkillLevel.P3, SkillLevel.P4);
            case "Advanced":
                return List.of(SkillLevel.P3, SkillLevel.P4);
            case "Expert":
                return List.of(SkillLevel.P4);

        }
        return Collections.emptyList();
    }

}