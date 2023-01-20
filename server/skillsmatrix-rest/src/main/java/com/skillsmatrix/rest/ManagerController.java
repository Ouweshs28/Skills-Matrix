package com.skillsmatrix.rest;

import com.skillsmatrix.dto.EmployeeResponse;
import com.skillsmatrix.dto.EmployeeSkillResponse;
import com.skillsmatrix.dto.SearchEmployeeCriteria;
import com.skillsmatrix.dto.SearchSkillLevel;
import com.skillsmatrix.dto.SkillHistoryResponse;
import com.skillsmatrix.dto.SkillHistoryReviewUpdateRequest;
import com.skillsmatrix.dto.SkillHistorySearchCriteria;
import com.skillsmatrix.dto.SkillObjectiveCreateRequest;
import com.skillsmatrix.dto.SkillObjectiveResponse;
import com.skillsmatrix.dto.SkillObjectiveSearchCriteria;
import com.skillsmatrix.dto.SkillObjectiveUpdateRequest;
import com.skillsmatrix.persistence.enumeration.Factory;
import com.skillsmatrix.persistence.enumeration.SkillLevel;
import com.skillsmatrix.persistence.enumeration.SkillObjectiveStatus;
import com.skillsmatrix.persistence.enumeration.SkillStatus;
import com.skillsmatrix.service.EmployeeService;
import com.skillsmatrix.service.SkillHistoryService;
import com.skillsmatrix.service.SkillObjectiveService;
import com.skillsmatrix.service.SkillService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import static org.springframework.data.domain.Sort.Direction.ASC;
import static org.springframework.data.domain.Sort.Direction.DESC;

/**
 * @author akn
 */
@CrossOrigin("*")
@RestController
@Transactional
@RequestMapping("/api/employees")
public class ManagerController {

    private final EmployeeService employeeService;
    private final SkillHistoryService skillHistoryService;
    private final SkillObjectiveService skillObjectiveService;
    private final SkillService skillService;

    public ManagerController(EmployeeService employeeService, SkillHistoryService skillHistoryService, SkillObjectiveService skillObjectiveService, SkillService skillService) {
        this.employeeService = employeeService;
        this.skillHistoryService = skillHistoryService;
        this.skillObjectiveService = skillObjectiveService;
        this.skillService = skillService;
    }

    // Employees

    @GetMapping("/search")
    public ResponseEntity<Page<EmployeeResponse>> searchEmployees(
            @RequestParam(value = "employeeName", required = false) String employeeName,
            @RequestParam(value = "domains", required = false) Long[] domainList,
            @RequestParam(value = "factory", required = false) Factory factory,
            @RequestParam(value = "skillLevels", required = false) String[] skillLevels,
            @RequestParam(value = "managerId", required = false) Long managerId,
            @RequestParam(value = "employeeId", required = false) Long[] employeeId,
            @RequestParam(value = "sortOrder") String sortOrder,
            @RequestParam(value = "sortBy") String sortBy,
            @RequestParam(value = "pageNumber") Integer pageNumber,
            @RequestParam(value = "pageSize") Integer pageSize) {
        Sort sort = Sort.by("DESC".equalsIgnoreCase(sortOrder) ? DESC : ASC, sortBy == null ? "firstName" : sortBy);
        SearchEmployeeCriteria.SearchEmployeeCriteriaBuilder searchEmployeeCriteriaBuilder = SearchEmployeeCriteria
                .builder()
                .employeeName(employeeName)
                .factory(factory);

        if (Objects.nonNull(skillLevels)) {
            searchEmployeeCriteriaBuilder.skillLevel(
                    Arrays.stream(skillLevels)
                            .map(s -> s.split("_"))
                            .map(ss -> new SearchSkillLevel(Long.parseLong(ss[0]), SkillLevel.valueOf(ss[1])))
                            .collect(Collectors.toList()));
        }

        if (Objects.nonNull(domainList)) {
            searchEmployeeCriteriaBuilder.domainList(List.of(domainList));
        }

        if (Objects.nonNull(employeeId)) {
            searchEmployeeCriteriaBuilder.employeeId(List.of(employeeId));
        }

        if (Objects.nonNull(managerId)) {
            searchEmployeeCriteriaBuilder.managerId(managerId);
        }

        return ResponseEntity.ok(employeeService
                .searchEmployees(searchEmployeeCriteriaBuilder.build(), PageRequest.of(pageNumber, pageSize, sort)));
    }

    @GetMapping("/all")
    public ResponseEntity<Page<EmployeeResponse>> searchManagersEmployees(
            @RequestParam(value = "employeeName", required = false) String employeeName,
            @RequestParam(value = "sortOrder") String sortOrder,
            @RequestParam(value = "sortBy") String sortBy,
            @RequestParam(value = "pageNumber") Integer pageNumber,
            @RequestParam(value = "pageSize") Integer pageSize) {
        Sort sort = Sort.by(
                "DESC".equalsIgnoreCase(sortOrder) ? DESC : ASC,
                sortBy == null ? "firstName" : sortBy);
        return ResponseEntity.ok(employeeService
                .searchManagedEmployees(employeeName, PageRequest.of(pageNumber, pageSize, sort)));
    }

    @GetMapping("/{employeeId}")
    public ResponseEntity<EmployeeResponse> findEmployeeById(@PathVariable("employeeId") Long employeeId) {
        return ResponseEntity.ok(employeeService.findEmployeeById(employeeId));
    }

    //Skills

    @GetMapping("/{employeeId}/skills")
    public ResponseEntity<Page<EmployeeSkillResponse>> findEmployeeSkills(
            @PathVariable("employeeId") Long employeeId,
            @RequestParam(value = "skillName", required = false) String skillName,
            @RequestParam(value = "sortOrder") String sortOrder,
            @RequestParam(value = "sortBy") String sortBy,
            @RequestParam(value = "pageNumber") Integer pageNumber,
            @RequestParam(value = "pageSize") Integer pageSize) {
        Sort sort = Sort.by(
                "DESC".equalsIgnoreCase(sortOrder) ? DESC : ASC,
                sortBy == null ? "skill.name" : sortBy);
        return ResponseEntity.ok(skillService
                .findEmployeeSkills(employeeId, skillName, PageRequest.of(pageNumber, pageSize, sort)));
    }

    // Objectives

    @PostMapping("/{employeeId}/objectives")
    public ResponseEntity<Void> createSkillObjective(
            @PathVariable("employeeId") Long employeeId,
            @Valid @RequestBody SkillObjectiveCreateRequest skillObjectiveCreateRequest) {
        skillObjectiveService.createSkillObjective(employeeId, skillObjectiveCreateRequest);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{employeeId}/objectives/{skillObjectiveId}")
    public ResponseEntity<SkillObjectiveResponse> createSkillObjective(
            @PathVariable("employeeId") Long employeeId,
            @PathVariable("skillObjectiveId") Long skillObjectiveId) {
        return ResponseEntity.ok(skillObjectiveService.findById(employeeId, skillObjectiveId));
    }

    @GetMapping("/all/objectives")
    public Page<SkillObjectiveResponse> searchEmployeeObjectives(
            @RequestParam(value = "dateFrom", required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate dateFrom,
            @RequestParam(value = "sortOrder") String sortOrder,
            @RequestParam(value = "sortBy") String sortBy,
            @RequestParam(value = "pageNumber") Integer pageNumber,
            @RequestParam(value = "pageSize") Integer pageSize) {
        Sort sort = Sort.by(
                "DESC".equalsIgnoreCase(sortOrder) ? DESC : ASC,
                sortBy == null ? "targetDate" : sortBy);
        return skillObjectiveService.searchAllObjectives(dateFrom, PageRequest.of(pageNumber, pageSize, sort));
    }

    @GetMapping("/{employeeId}/objectives")
    public Page<SkillObjectiveResponse> searchEmployeeObjectives(
            @PathVariable("employeeId") Long employeeId,
            @RequestParam(value = "dateFrom", required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate dateFrom,
            @RequestParam(value = "skillId", required = false) Long skillId,
            @RequestParam(value = "status", required = false) SkillObjectiveStatus status,
            @RequestParam(value = "sortOrder") String sortOrder,
            @RequestParam(value = "sortBy") String sortBy,
            @RequestParam(value = "pageNumber") Integer pageNumber,
            @RequestParam(value = "pageSize") Integer pageSize) {
        Sort sort = Sort.by(
                "DESC".equalsIgnoreCase(sortOrder) ? DESC : ASC,
                sortBy == null ? "targetDate" : sortBy);
        SkillObjectiveSearchCriteria.SkillObjectiveSearchCriteriaBuilder searchCriteriaBuilder = SkillObjectiveSearchCriteria.builder();
        if (Objects.nonNull(status)) {
            searchCriteriaBuilder.status(status);
        }
        if (Objects.nonNull(skillId)) {
            searchCriteriaBuilder.skillId(skillId);
        }

        if (Objects.nonNull(dateFrom)) {
            searchCriteriaBuilder.dateFrom(dateFrom);
        }
        return skillObjectiveService.searchObjectives(employeeId, searchCriteriaBuilder.build(), PageRequest.of(pageNumber, pageSize, sort));
    }

    @PutMapping("/{employeeId}/objectives/{skillObjectiveId}")
    public ResponseEntity<Void> updateSkillObjective(
            @PathVariable("employeeId") Long employeeId,
            @PathVariable("skillObjectiveId") Long skillObjectiveId,
            @Valid @RequestBody SkillObjectiveUpdateRequest skillObjectiveUpdateRequest) {
        skillObjectiveService.updateSkillObjective(employeeId, skillObjectiveId, skillObjectiveUpdateRequest);
        return ResponseEntity.noContent().build();
    }

    // Skill History

    @PostMapping("/{employeeId}/history/reviewers")
    public ResponseEntity<Void> assignReviewer(
            @PathVariable("employeeId") Long employeeId,
            @RequestBody Long[] reviewers) {
        skillHistoryService.assignReviewer(employeeId, List.of(reviewers));
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{employeeId}/history/{skillHistoryStatus}")
    public Page<SkillHistoryResponse> searchEmployeeSkillHistory(
            @PathVariable("employeeId") Long employeeId,
            @PathVariable(value = "skillHistoryStatus") SkillStatus skillHistoryStatus,
            @RequestParam(value = "keyword", required = false) String keyword,
            @RequestParam(value = "skillId", required = false) Long skillId,
            @RequestParam(value = "sortOrder") String sortOrder,
            @RequestParam(value = "sortBy") String sortBy,
            @RequestParam(value = "pageNumber") Integer pageNumber,
            @RequestParam(value = "pageSize") Integer pageSize) {
        Sort sort = Sort.by("DESC".equalsIgnoreCase(sortOrder) ? DESC : ASC, sortBy == null ? "targetDate" : sortBy);
        SkillHistorySearchCriteria.SkillHistorySearchCriteriaBuilder searchCriteriaBuilder = SkillHistorySearchCriteria.builder();
        if (Objects.nonNull(keyword)) {
            searchCriteriaBuilder.keyword(keyword);
        }
        if (Objects.nonNull(skillId)) {
            searchCriteriaBuilder.skillId(skillId);
        }
        searchCriteriaBuilder.skillStatus(skillHistoryStatus);
        return skillHistoryService.searchSkillHistory(employeeId, searchCriteriaBuilder.build(), PageRequest.of(pageNumber, pageSize, sort));
    }

    @PutMapping("/{employeeId}/history/{skillHistoryId}")
    public ResponseEntity<Void> updateSkillHistory(
            @PathVariable("employeeId") Long employeeId,
            @PathVariable("skillHistoryId") Long skillHistoryId,
            @Valid @RequestBody SkillHistoryReviewUpdateRequest skillHistoryReviewUpdateRequest) {
        skillHistoryService.updateSkillHistory(employeeId, skillHistoryId, skillHistoryReviewUpdateRequest);
        return ResponseEntity.noContent().build();
    }

    // Skill Review

    @GetMapping("/{employeeId}/reviewers")
    public ResponseEntity<Page<EmployeeResponse>> findAssignedReviewersByEmployeeId(@PathVariable("employeeId") Long employeeId) {
        return ResponseEntity.ok(new PageImpl<>(skillHistoryService.findAssignedReviewersByEmployeeId(employeeId)));
    }

    @GetMapping("/review/{employeeId}")
    public ResponseEntity<Page<SkillHistoryResponse>> findEmployeeSkillHistoryByEmployeeId(
            @PathVariable("employeeId") Long employeeId,
            @RequestParam(value = "sortOrder") String sortOrder,
            @RequestParam(value = "sortBy") String sortBy,
            @RequestParam(value = "pageNumber") Integer pageNumber,
            @RequestParam(value = "pageSize") Integer pageSize) {
        Sort sort = Sort.by("DESC".equalsIgnoreCase(sortOrder) ? DESC : ASC, sortBy == null ? "name" : sortBy);
        return ResponseEntity.ok(skillHistoryService
                .findSkillHistoryByEmployeeId(employeeId, PageRequest.of(pageNumber, pageSize, sort)));
    }

    @GetMapping("/{employeeId}/reviewer/{reviewerId}/review")
    public ResponseEntity<Page<SkillHistoryResponse>> findEmployeeSkillHistoryByReviewerId(
            @PathVariable("employeeId") Long employeeId,
            @PathVariable("reviewerId") Long reviewerId,
            @RequestParam(value = "sortOrder") String sortOrder,
            @RequestParam(value = "sortBy") String sortBy,
            @RequestParam(value = "pageNumber") Integer pageNumber,
            @RequestParam(value = "pageSize") Integer pageSize) {
        Sort sort = Sort.by("DESC".equalsIgnoreCase(sortOrder) ? DESC : ASC, sortBy == null ? "name" : sortBy);
        return ResponseEntity.ok(skillHistoryService
                .findSkillHistoryByReviewerId(employeeId, reviewerId, PageRequest.of(pageNumber, pageSize, sort)));
    }

}
