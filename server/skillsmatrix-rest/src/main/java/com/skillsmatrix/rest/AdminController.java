package com.skillsmatrix.rest;

import com.skillsmatrix.dto.EmployeeCreateOrUpdateRequest;
import com.skillsmatrix.dto.EmployeeDomainCreateOrUpdateRequest;
import com.skillsmatrix.dto.EmployeeDomainResponse;
import com.skillsmatrix.dto.SkillCategoryCreateOrUpdateRequest;
import com.skillsmatrix.dto.SkillCategoryResponse;
import com.skillsmatrix.dto.SkillCreateOrUpdateRequest;
import com.skillsmatrix.dto.SkillResponse;
import com.skillsmatrix.service.EmployeeDomainService;
import com.skillsmatrix.service.EmployeeService;
import com.skillsmatrix.service.SkillCategoryService;
import com.skillsmatrix.service.SkillHistoryService;
import com.skillsmatrix.service.SkillService;
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
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;

/**
 * @author zaf
 */
@CrossOrigin("*")
@RestController
@RequestMapping("/api/admin")
@Transactional
public class AdminController {

    private final EmployeeService employeeService;
    private final SkillService skillService;
    private final SkillCategoryService skillCategoryService;
    private final EmployeeDomainService employeeDomainService;
    private final SkillHistoryService skillHistoryService;

    public AdminController(EmployeeService employeeService, SkillService skillService, SkillCategoryService skillCategoryService, EmployeeDomainService employeeDomainService, SkillHistoryService skillHistoryService) {
        this.employeeService = employeeService;
        this.skillService = skillService;
        this.skillCategoryService = skillCategoryService;
        this.employeeDomainService = employeeDomainService;
        this.skillHistoryService = skillHistoryService;
    }

    // Employee

    @PostMapping("/employees")
    public ResponseEntity<Void> createEmployee(@RequestBody EmployeeCreateOrUpdateRequest employeeCreateOrUpdateRequest) {
        employeeService.createEmployee(employeeCreateOrUpdateRequest);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/eployees/{employeeId}")
    public ResponseEntity<Void> archiveEmployee(@PathVariable("employeeId") Long employeeId) {
        employeeService.archiveEmployee(employeeId);
        return ResponseEntity.noContent().build();
    }

    // Skills

    @PostMapping("/skills")
    public void createSkill(@Valid @RequestBody SkillCreateOrUpdateRequest skillCreateOrUpdateRequest) {
        skillService.createSkill(skillCreateOrUpdateRequest);
    }

    @PostMapping("/categories")
    public void createSkillCategory(@RequestBody SkillCategoryCreateOrUpdateRequest skillCategoryCreateOrUpdateRequest) {
        skillCategoryService.createSkillCategory(skillCategoryCreateOrUpdateRequest);
    }

    @PostMapping("/domains")
    public void createEmployeeDomain(@RequestBody EmployeeDomainCreateOrUpdateRequest employeeDomainCreateOrUpdateRequest) {
        employeeDomainService.createEmployeeDomain(employeeDomainCreateOrUpdateRequest);
    }

    @GetMapping("/{skillId}")
    public SkillResponse findSkillById(@PathVariable("skillId") Long skillId) {
        return skillService.findSkillById(skillId);
    }

    @GetMapping("/categories/{skillCategoryId}")
    public SkillCategoryResponse findSkillCategoryById(@PathVariable("skillCategoryId") Long skillCategoryId) {
        return skillCategoryService.findSkillCategoryById(skillCategoryId);
    }

    @GetMapping("/domains/{employeeDomainId}")
    public EmployeeDomainResponse findEmployeeDomainById(@PathVariable("employeeDomainId") Long employeeDomainId) {
        return employeeDomainService.findEmployeeDomainById(employeeDomainId);
    }

    @PutMapping("/{skillId}")
    public void updateSkill(@PathVariable("skillId") Long skillId, @RequestBody SkillCreateOrUpdateRequest skillCreateOrUpdateRequest) {
        skillService.updateSkill(skillId, skillCreateOrUpdateRequest);
    }

    @PutMapping("/categories/{skillCategoryId}")
    public void updateSkillCategory(@PathVariable("skillCategoryId") Long skillCategoryId, @RequestBody SkillCategoryCreateOrUpdateRequest skillCategoryCreateOrUpdateRequest) {
        skillCategoryService.updateSkillCategory(skillCategoryId, skillCategoryCreateOrUpdateRequest);
    }

    @PutMapping("/domains/{employeeDomainId}")
    public void updateEmployeeDomain(@PathVariable("employeeDomainId") Long employeeDomainId, @RequestBody EmployeeDomainCreateOrUpdateRequest employeeDomainCreateOrUpdateRequest) {
        employeeDomainService.updateEmployeeDomain(employeeDomainId, employeeDomainCreateOrUpdateRequest);
    }

    @PutMapping("/archive/{skillId}")
    public void archiveSkill(@PathVariable("skillId") Long skillId) {
        skillService.archiveSkill(skillId);
    }

    @PutMapping("/categories/archive/{skillCategoryId}")
    public void archiveSkillCategory(@PathVariable("skillCategoryId") Long skillCategoryId) {
        skillCategoryService.archiveSkillCategory(skillCategoryId);
    }

    @PutMapping("/domains/archive/{employeeDomainId}")
    public void archiveEmployeeDomain(@PathVariable("employeeDomainId") Long employeeDomainId) {
        employeeDomainService.archiveEmployeeDomain(employeeDomainId);
    }

}