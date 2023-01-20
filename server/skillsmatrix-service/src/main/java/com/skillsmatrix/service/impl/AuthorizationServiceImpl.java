package com.skillsmatrix.service.impl;

import com.skillsmatrix.exception.UnauthorizedException;
import com.skillsmatrix.persistence.entity.Employee;
import com.skillsmatrix.persistence.repository.EmployeeRepository;
import com.skillsmatrix.persistence.repository.SkillHistoryRepository;
import com.skillsmatrix.service.AuthorizationService;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

/**
 * @author akn
 */
@Service
public class AuthorizationServiceImpl implements AuthorizationService {

    private final EmployeeRepository employeeRepository;
    private final SkillHistoryRepository skillHistoryRepository;

    public AuthorizationServiceImpl(EmployeeRepository employeeRepository, SkillHistoryRepository skillHistoryRepository) {
        this.employeeRepository = employeeRepository;
        this.skillHistoryRepository = skillHistoryRepository;
    }

    @Override
    public Long getUserId() {
        String visa = SecurityContextHolder.getContext().getAuthentication().getName();
        return employeeRepository.findByVisa(visa).map(Employee::getId).orElseThrow(() -> new UnauthorizedException("You do not have access"));
    }

    @Override
    public void verifyIfManagerHasAccess(Long employeeId) {
        String visa = SecurityContextHolder.getContext().getAuthentication().getName();
        Employee manager = employeeRepository.findByVisa(visa).orElseThrow();
        Employee employee = employeeRepository.findById(employeeId).orElseThrow();
        if (!employee.getManager().getId().equals(manager.getId())) {
            throw new UnauthorizedException("You do not have access to this resource");
        }
    }

    @Override
    public void verifyIfReviewerHasAccess(Long employeeId) {
        skillHistoryRepository.findFirstByEmployeeIdAndReviewerId(employeeId, getUserId())
                .orElseThrow(() -> new UnauthorizedException("You do not have access to this resource"));
    }

}
