package com.skillsmatrix.rest;

import com.skillsmatrix.dto.EmployeeDomainResponse;
import com.skillsmatrix.dto.SkillCategoryResponse;
import com.skillsmatrix.dto.SkillResponse;
import com.skillsmatrix.service.EmployeeDomainService;
import com.skillsmatrix.service.SkillCategoryService;
import com.skillsmatrix.service.SkillService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Objects;

/**
 * @author zaf
 */
@RestController
@RequestMapping("/api/skills")
@Transactional
@CrossOrigin
public class SkillSearchController {

    private final SkillService skillService;
    private final SkillCategoryService skillCategoryService;
    private final EmployeeDomainService employeeDomainService;

    public SkillSearchController(SkillService skillService, SkillCategoryService skillCategoryService, EmployeeDomainService employeeDomainService) {
        this.skillService = skillService;
        this.skillCategoryService = skillCategoryService;
        this.employeeDomainService = employeeDomainService;
    }

    @GetMapping("/search")
    public Page<SkillResponse> searchSkills(@RequestParam(value = "keyword", required = false) String keyword,
                                            @RequestParam(value = "existingSkill", required = false) Long[] existingSkill,
                                            @RequestParam(value = "sortOrder") String sortOrder,
                                            @RequestParam(value = "sortBy") String sortBy,
                                            @RequestParam(value = "pageNumber") Integer pageNumber,
                                            @RequestParam(value = "pageSize") Integer pageSize) {
        Sort sort = Sort.by("DESC".equalsIgnoreCase(sortOrder) ? Sort.Direction.DESC : Sort.Direction.ASC, sortBy);
        if (Objects.nonNull(existingSkill)) {
            return skillService.searchSkills(
                    keyword,
                    List.of(existingSkill),
                    PageRequest.of(pageNumber, pageSize, sort));
        }
        return skillService.searchSkills(
                keyword,
                PageRequest.of(pageNumber, pageSize, sort));
    }

    @GetMapping("/categories/search")
    public Page<SkillCategoryResponse> searchSkillCategories(@RequestParam(value = "keyword", required = false) String keyword,
                                                             @RequestParam(value = "sortOrder") String sortOrder,
                                                             @RequestParam(value = "sortBy") String sortBy,
                                                             @RequestParam(value = "pageNumber") Integer pageNumber,
                                                             @RequestParam(value = "pageSize") Integer pageSize) {
        Sort sort = Sort.by("DESC".equalsIgnoreCase(sortOrder) ? Sort.Direction.DESC : Sort.Direction.ASC, sortBy);
        return skillCategoryService.searchSkillCategory(
                keyword,
                PageRequest.of(pageNumber, pageSize, sort));
    }

    @GetMapping("/domains/search")
    public Page<EmployeeDomainResponse> searchEmployeeDomains(@RequestParam(value = "keyword", required = false) String keyword,
                                                              @RequestParam(value = "sortOrder") String sortOrder,
                                                              @RequestParam(value = "sortBy") String sortBy,
                                                              @RequestParam(value = "pageNumber") Integer pageNumber,
                                                              @RequestParam(value = "pageSize") Integer pageSize) {
        Sort sort = Sort.by("DESC".equalsIgnoreCase(sortOrder) ? Sort.Direction.DESC : Sort.Direction.ASC, sortBy);
        return employeeDomainService.searchEmployeeDomain(
                keyword,
                PageRequest.of(pageNumber, pageSize, sort));
    }

}
