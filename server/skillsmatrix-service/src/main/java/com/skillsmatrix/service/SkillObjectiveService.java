package com.skillsmatrix.service;

import com.skillsmatrix.dto.SkillObjectiveCreateRequest;
import com.skillsmatrix.dto.SkillObjectiveResponse;
import com.skillsmatrix.dto.SkillObjectiveSearchCriteria;
import com.skillsmatrix.dto.SkillObjectiveUpdateRequest;
import com.skillsmatrix.persistence.entity.SkillObjective;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import java.time.LocalDate;

public interface SkillObjectiveService {

    /**
     * Allows a manager to set an objective.
     *
     * @param employeeId                  the employee identifier
     * @param skillObjectiveCreateRequest the {@link SkillObjectiveCreateRequest}
     */
    void createSkillObjective(Long employeeId, SkillObjectiveCreateRequest skillObjectiveCreateRequest);

    /**
     * Allows a manager to search an objective.
     *
     * @param employeeId       the employee identifier
     * @param skillObjectiveId the objective identifier
     */
    SkillObjectiveResponse findById(Long employeeId, Long skillObjectiveId);

    /**
     * Allows current user to search for his {@link SkillObjective}
     *
     * @param searchCriteria the {@link SkillObjectiveSearchCriteria}
     * @param pageRequest    the {@link PageRequest}
     * @return the paged collection of {@link SkillObjectiveResponse}
     */
    Page<SkillObjectiveResponse> searchObjectives(SkillObjectiveSearchCriteria searchCriteria, PageRequest pageRequest);

    /**
     * Allows a manager to search for an employee's objectives.
     *
     * @param employeeId     the employee identifier
     * @param searchCriteria the {@link SkillObjectiveSearchCriteria}
     * @param pageRequest    the {@link PageRequest}
     * @return the paged collection of {@link SkillObjectiveResponse}
     */
    Page<SkillObjectiveResponse> searchObjectives(Long employeeId, SkillObjectiveSearchCriteria searchCriteria, PageRequest pageRequest);

    /**
     * Allows a manager to search for all employees objectives.
     *
     * @param dateFrom    te date filter to search from
     * @param pageRequest the {@link PageRequest}
     * @return the paged collection of {@link SkillObjectiveResponse}
     */
    Page<SkillObjectiveResponse> searchAllObjectives(LocalDate dateFrom, PageRequest pageRequest);

    /**
     * Allows a manager to update a skill objective.
     *
     * @param employeeId                  the employee identifier
     * @param skillObjectiveId            the skill objective identifier
     * @param skillObjectiveUpdateRequest the {@link SkillObjectiveUpdateRequest}
     */
    void updateSkillObjective(Long employeeId, Long skillObjectiveId, SkillObjectiveUpdateRequest skillObjectiveUpdateRequest);

}