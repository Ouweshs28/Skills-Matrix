package com.skillsmatrix.service;

import com.skillsmatrix.dto.EmployeeDomainCreateOrUpdateRequest;
import com.skillsmatrix.dto.EmployeeDomainResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

/**
 * @author zaf
 */
public interface EmployeeDomainService {

    void createEmployeeDomain(EmployeeDomainCreateOrUpdateRequest employeeDomainCreateOrUpdateRequest);

    Page<EmployeeDomainResponse> searchEmployeeDomain(String keyword, PageRequest pageRequest);

    EmployeeDomainResponse findEmployeeDomainById(Long employeeDomainId);

    void updateEmployeeDomain(Long employeeDomainId, EmployeeDomainCreateOrUpdateRequest employeeDomainCreateOrUpdateRequest);

    void archiveEmployeeDomain(Long employeeDomainId);

}