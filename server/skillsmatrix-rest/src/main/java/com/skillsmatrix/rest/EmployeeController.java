package com.skillsmatrix.rest;

import com.skillsmatrix.dto.EmployeeCreateOrUpdateRequest;
import com.skillsmatrix.dto.EmployeeResponse;
import com.skillsmatrix.dto.EmployeeSkillResponse;
import com.skillsmatrix.dto.ManagerResponse;
import com.skillsmatrix.dto.SkillHistoryCreateRequest;
import com.skillsmatrix.dto.SkillHistoryResponse;
import com.skillsmatrix.dto.SkillHistorySearchCriteria;
import com.skillsmatrix.dto.SkillHistoryUpdateRequest;
import com.skillsmatrix.dto.SkillObjectiveResponse;
import com.skillsmatrix.dto.SkillObjectiveSearchCriteria;
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
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import java.util.Objects;

import static org.springframework.data.domain.Sort.Direction.ASC;
import static org.springframework.data.domain.Sort.Direction.DESC;

@CrossOrigin("*")
@RestController
@Transactional
@RequestMapping("/api/employees/me")
public class EmployeeController {

    private final EmployeeService employeeService;
    private final SkillService skillService;
    private final SkillHistoryService skillHistoryService;
    private final SkillObjectiveService skillObjectiveService;

    public EmployeeController(EmployeeService employeeService, SkillService skillService, SkillHistoryService skillHistoryService, SkillObjectiveService skillObjectiveService) {
        this.employeeService = employeeService;
        this.skillService = skillService;
        this.skillHistoryService = skillHistoryService;
        this.skillObjectiveService = skillObjectiveService;
    }

    @PostMapping(value = "/logout")
    public ResponseEntity<String> logout(HttpServletRequest request) throws ServletException {
        request.logout();
        return ResponseEntity.ok("redirect:/");
    }

    @GetMapping("/")
    public ResponseEntity<EmployeeResponse> getCurrentUser() {
        return ResponseEntity.ok(employeeService.getCurrentUser());
    }

    @GetMapping("/managers")
    public ResponseEntity<Page<ManagerResponse>> searchManagers(
            @RequestParam(value = "employeeName", required = false) String employeeName,
            @RequestParam(value = "sortOrder") String sortOrder,
            @RequestParam(value = "sortBy") String sortBy,
            @RequestParam(value = "pageNumber") Integer pageNumber,
            @RequestParam(value = "pageSize") Integer pageSize) {
        Sort sort = Sort.by(
                "DESC".equalsIgnoreCase(sortOrder) ? DESC : ASC,
                sortBy == null ? "firstName" : sortBy);
        return ResponseEntity.ok(employeeService
                .searchManagers(employeeName, PageRequest.of(pageNumber, pageSize, sort)));
    }

    @PutMapping("/")
    public ResponseEntity<EmployeeResponse> updateProfile(@RequestBody EmployeeCreateOrUpdateRequest employeeCreateOrUpdateRequest) {
        employeeService.updateProfile(employeeCreateOrUpdateRequest);
        return ResponseEntity.noContent().build();
    }

    // Objectives

    @GetMapping("/objectives")
    public ResponseEntity<Page<SkillObjectiveResponse>> searchObjectives(
            @RequestParam(value = "status", required = false) SkillObjectiveStatus status,
            @RequestParam(value = "skillId", required = false) Long skillId,
            @RequestParam(value = "currentSkillLevel", required = false) SkillLevel currentSkillLevel,
            @RequestParam(value = "sortOrder") String sortOrder,
            @RequestParam(value = "sortBy") String sortBy,
            @RequestParam(value = "pageNumber") Integer pageNumber,
            @RequestParam(value = "pageSize") Integer pageSize) {
        Sort sort = Sort.by(
                "DESC".equalsIgnoreCase(sortOrder) ? DESC : ASC,
                sortBy == null ? "targetDate" : sortBy);
        SkillObjectiveSearchCriteria.SkillObjectiveSearchCriteriaBuilder skillObjectiveSearchCriteriaBuilder = SkillObjectiveSearchCriteria.builder();
        if (Objects.nonNull(status)) {
            skillObjectiveSearchCriteriaBuilder.status(status);
        }
        if (Objects.nonNull(skillId)) {
            skillObjectiveSearchCriteriaBuilder.skillId(skillId);
        }
        if (Objects.nonNull(currentSkillLevel)) {
            skillObjectiveSearchCriteriaBuilder.currentSkillLevel(currentSkillLevel);
        }
        return ResponseEntity.ok(skillObjectiveService
                .searchObjectives(skillObjectiveSearchCriteriaBuilder.build(), PageRequest.of(pageNumber, pageSize, sort)));
    }

    // Skills

    @GetMapping("/skills")
    public ResponseEntity<Page<EmployeeSkillResponse>> findEmployeeSkills(
            @RequestParam(value = "skillName", required = false) String skillName,
            @RequestParam(value = "sortOrder") String sortOrder,
            @RequestParam(value = "sortBy") String sortBy,
            @RequestParam(value = "pageNumber") Integer pageNumber,
            @RequestParam(value = "pageSize") Integer pageSize) {
        Sort sort = Sort.by(
                "DESC".equalsIgnoreCase(sortOrder) ? DESC : ASC,
                sortBy == null ? "skill.name" : sortBy);
        return ResponseEntity.ok(skillService
                .findEmployeeSkills(skillName, PageRequest.of(pageNumber, pageSize, sort)));
    }

    // Skill History

    @PostMapping("/history")
    public ResponseEntity<Void> createSkillHistory(@Valid @RequestBody SkillHistoryCreateRequest skillHistoryCreateRequest) {
        skillHistoryService.createSkillHistory(skillHistoryCreateRequest);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/history")
    public ResponseEntity<Page<SkillHistoryResponse>> searchSkillHistory(
            @RequestParam(value = "skillHistoryStatus", required = false) SkillStatus skillHistoryStatus,
            @RequestParam(value = "skillId", required = false) Long skillId,
            @RequestParam(value = "keyword", required = false) String keyword,
            @RequestParam(value = "sortOrder") String sortOrder,
            @RequestParam(value = "sortBy") String sortBy,
            @RequestParam(value = "pageNumber") Integer pageNumber,
            @RequestParam(value = "pageSize") Integer pageSize) {
        Sort sort = Sort.by(
                "DESC".equalsIgnoreCase(sortOrder) ? DESC : ASC,
                sortBy == null ? "name" : sortBy);
        SkillHistorySearchCriteria.SkillHistorySearchCriteriaBuilder searchCriteriaBuilder = SkillHistorySearchCriteria.builder();
        if (Objects.nonNull(keyword)) {
            searchCriteriaBuilder.keyword(keyword);
        }
        if (Objects.nonNull(skillId)) {
            searchCriteriaBuilder.skillId(skillId);
        }
        if (Objects.nonNull(skillHistoryStatus)) {
            searchCriteriaBuilder.skillStatus(skillHistoryStatus);
        }
        return ResponseEntity.ok(skillHistoryService
                .searchSkillHistory(searchCriteriaBuilder.build(), PageRequest.of(pageNumber, pageSize, sort)));
    }

    @PutMapping("/history/{skillHistoryId}")
    public ResponseEntity<Void> updateSkillHistory(@PathVariable("skillHistoryId") Long skillHistoryId,
                                                   @Valid @RequestBody SkillHistoryUpdateRequest skillHistoryUpdateRequest) {
        skillHistoryService.updateSkillHistory(skillHistoryId, skillHistoryUpdateRequest);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/history/{skillHistoryId}")
    public ResponseEntity<Void> deleteSkillHistory(@PathVariable("skillHistoryId") Long skillHistoryId) {
        skillHistoryService.deleteSkillHistory(skillHistoryId);
        return ResponseEntity.noContent().build();
    }

    // Skill Review

    @GetMapping("/review")
    public ResponseEntity<Page<EmployeeResponse>> findEmployeesToReview(@RequestParam(value = "keyword", required = false) String keyword) {
        return ResponseEntity.ok(new PageImpl<>(skillHistoryService.findEmployeesToReview(keyword)));
    }

}
