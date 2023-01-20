package com.skillsmatrix.service;

import com.skillsmatrix.dto.EmployeeResponse;
import com.skillsmatrix.dto.SkillHistoryCreateRequest;
import com.skillsmatrix.dto.SkillHistoryResponse;
import com.skillsmatrix.dto.SkillHistoryReviewUpdateRequest;
import com.skillsmatrix.dto.SkillHistorySearchCriteria;
import com.skillsmatrix.dto.SkillHistoryUpdateRequest;
import com.skillsmatrix.persistence.entity.SkillHistory;
import com.skillsmatrix.persistence.entity.Employee;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import java.util.List;

/**
 * @author zaf
 */
public interface SkillHistoryService {

    /**
     * Creates a  {@link SkillHistory} for the current user.
     *
     * @param skillHistoryCreateRequest the {@link SkillHistoryCreateRequest}
     */
    void createSkillHistory(SkillHistoryCreateRequest skillHistoryCreateRequest);

    /**
     * Allows current user to search for his skill history.
     *
     * @param searchCriteria the {@link SkillHistorySearchCriteria}
     * @param pageRequest    the {@link PageRequest}
     * @return the paged collection of {@link SkillHistoryResponse}
     */
    Page<SkillHistoryResponse> searchSkillHistory(SkillHistorySearchCriteria searchCriteria, PageRequest pageRequest);

    /**
     * Allows a manager to search for employee his skill history.
     *
     * @param employeeId     the {@link Employee} identifier
     * @param searchCriteria the {@link SkillHistorySearchCriteria}
     * @param pageRequest    the {@link PageRequest}
     * @return the paged collection of {@link SkillHistoryResponse}
     */
    Page<SkillHistoryResponse> searchSkillHistory(Long employeeId, SkillHistorySearchCriteria searchCriteria, PageRequest pageRequest);

    /**
     * Allows a manager to retrieve the list of current reviewers for an employee.
     *
     * @param employeeId the {@link Employee} identifier
     * @return the list of {@link EmployeeResponse}
     */
    List<EmployeeResponse> findAssignedReviewersByEmployeeId(Long employeeId);

    /**
     * Allows a reviewer to retrieve the list of current employees for review.
     *
     * @param keyword
     * @return the list of {@link EmployeeResponse}
     */
    List<EmployeeResponse> findEmployeesToReview(String keyword);

    /**
     * Allows a manager to retrieve the skill history by a reviewer for an employee.
     *
     * @param employeeId  the {@link Employee} identifier
     * @param reviewerId  the {@link Employee} identifier
     * @param pageRequest the {@link PageRequest}
     * @return the paged collection of {@link SkillHistoryResponse}
     */
    Page<SkillHistoryResponse> findSkillHistoryByReviewerId(Long employeeId, Long reviewerId, PageRequest pageRequest);

    /**
     * Allows a reviewer to retrieve the skill history for an employee.
     *
     * @param employeeId  the {@link Employee} identifier
     * @param pageRequest the {@link PageRequest}
     * @return the paged collection of {@link SkillHistoryResponse}
     */
    Page<SkillHistoryResponse> findSkillHistoryByEmployeeId(Long employeeId, PageRequest pageRequest);


    /**
     * Allows current user to update a {@link SkillHistory}.
     *
     * @param skillHistoryId            the {@link SkillHistory} identifier
     * @param skillHistoryUpdateRequest the {@link SkillHistoryUpdateRequest}
     */
    void updateSkillHistory(Long skillHistoryId, SkillHistoryUpdateRequest skillHistoryUpdateRequest);

    /**
     * Allows a manager to update an employee's {@link SkillHistory}.
     *
     * @param employeeId                      the {@link Employee} identifier
     * @param skillHistoryId                  the {@link SkillHistory} identifier
     * @param skillHistoryReviewUpdateRequest the {@link SkillHistoryReviewUpdateRequest}
     */
    void updateSkillHistory(Long employeeId, Long skillHistoryId, SkillHistoryReviewUpdateRequest skillHistoryReviewUpdateRequest);

    /**
     * Allows a manager to assign a reviewer for an employee.
     *
     * @param employeeId the {@link Employee} identifier
     * @param reviewers  the list of reviewers
     */
    void assignReviewer(Long employeeId, List<Long> reviewers);

    /**
     * Allows current user to delete a {@link SkillHistory}
     *
     * @param skillHistoryId the {@link SkillHistory} identifier
     */
    void deleteSkillHistory(Long skillHistoryId);

}