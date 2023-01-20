package com.skillsmatrix.service;

import com.skillsmatrix.dto.EmployeeCreateOrUpdateRequest;
import com.skillsmatrix.dto.EmployeeResponse;
import com.skillsmatrix.dto.ManagerResponse;
import com.skillsmatrix.dto.SearchEmployeeCriteria;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

public interface EmployeeService {

    /**
     * Allows an administrator to register a new employee.
     *
     * @param employeeCreateOrUpdateRequest the {@link EmployeeCreateOrUpdateRequest}
     */
    void createEmployee(EmployeeCreateOrUpdateRequest employeeCreateOrUpdateRequest);

    /**
     * Returns the current user's profile.
     *
     * @return the {@link EmployeeResponse}
     */
    EmployeeResponse getCurrentUser();

    /**
     * Returns the current user's managers.
     *
     * @param name        the name to filter on
     * @param pageRequest the {@link PageRequest}
     * @return the paged collection of {@link ManagerResponse}
     */
    Page<ManagerResponse> searchManagers(String name, PageRequest pageRequest);

    /**
     * Allows a manager or admin to search for employees.
     *
     * @param searchCriteria the {@link SearchEmployeeCriteria} to filter on
     * @param pageRequest    the {@link PageRequest}
     * @return the paged collection of {@link EmployeeResponse}
     */
    Page<EmployeeResponse> searchEmployees(SearchEmployeeCriteria searchCriteria, PageRequest pageRequest);

    /**
     * Allows a manager to search for his employees.
     *
     * @param name        the name to filter on
     * @param pageRequest the {@link PageRequest}
     * @return the paged collection of {@link EmployeeResponse}
     */
    Page<EmployeeResponse> searchManagedEmployees(String name, PageRequest pageRequest);

    /**
     * Allows a manager or admin to retrieve an employee.
     *
     * @param employeeId the employee identifier
     * @return the {@link EmployeeResponse}
     */
    EmployeeResponse findEmployeeById(Long employeeId);

    /**
     * Allows the current user to update his profile.
     *
     * @param employeeCreateOrUpdateRequest the {@link EmployeeCreateOrUpdateRequest}
     */
    void updateProfile(EmployeeCreateOrUpdateRequest employeeCreateOrUpdateRequest);

    /**
     * Allows an administrator to archive an employee.
     *
     * @param employeeId the employee identifier
     */
    void archiveEmployee(Long employeeId);

}