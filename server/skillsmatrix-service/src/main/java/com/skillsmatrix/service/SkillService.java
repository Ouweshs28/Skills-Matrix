package com.skillsmatrix.service;

import com.skillsmatrix.dto.EmployeeSkillResponse;
import com.skillsmatrix.dto.SkillCreateOrUpdateRequest;
import com.skillsmatrix.dto.SkillResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import java.util.List;

/**
 * @author zaf
 */
public interface SkillService {

    /**
     * Returns the current user's skills.
     *
     * @param skillName   the skill name
     * @param pageRequest the {@link PageRequest}
     * @return the paged collection of {@link EmployeeSkillResponse}
     */
    Page<EmployeeSkillResponse> findEmployeeSkills(String skillName, PageRequest pageRequest);

    /**
     * Allows a manager to search for an employee's skills.
     *
     * @param employeeId  the employee identifier
     * @param skillName   the skillName
     * @param pageRequest the {@link PageRequest}
     * @return the paged collection of {@link EmployeeSkillResponse}
     */
    Page<EmployeeSkillResponse> findEmployeeSkills(Long employeeId, String skillName, PageRequest pageRequest);

    void createSkill(SkillCreateOrUpdateRequest skillCreateOrUpdateRequest);

    SkillResponse findSkillById(Long skillId);

    Page<SkillResponse> searchSkills(String keyword, PageRequest pageRequest);

    Page<SkillResponse> searchSkills(String keyword, List<Long> existingSkill, PageRequest pageRequest);

    void updateSkill(Long skillId, SkillCreateOrUpdateRequest skillCreateOrUpdateRequest);

    void archiveSkill(Long skillId);

}