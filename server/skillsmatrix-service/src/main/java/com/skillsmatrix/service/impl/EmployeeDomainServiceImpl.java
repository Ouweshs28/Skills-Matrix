package com.skillsmatrix.service.impl;

import com.skillsmatrix.dto.EmployeeDomainCreateOrUpdateRequest;
import com.skillsmatrix.dto.EmployeeDomainResponse;
import com.skillsmatrix.exception.ResourceNotFoundException;
import com.skillsmatrix.mapper.EmployeeDomainMapper;
import com.skillsmatrix.persistence.entity.EmployeeDomain;
import com.skillsmatrix.persistence.entity.QEmployeeDomain;
import com.skillsmatrix.persistence.repository.EmployeeDomainRepository;
import com.skillsmatrix.service.EmployeeDomainService;
import com.querydsl.core.BooleanBuilder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.Locale;
import java.util.Objects;

/**
 * @author zaf
 */
@Service
public class EmployeeDomainServiceImpl implements EmployeeDomainService {

    private final EmployeeDomainRepository employeeDomainRepository;
    private final EmployeeDomainMapper employeeDomainMapper;

    public EmployeeDomainServiceImpl(EmployeeDomainRepository employeeDomainRepository, EmployeeDomainMapper employeeDomainMapper) {
        this.employeeDomainRepository = employeeDomainRepository;
        this.employeeDomainMapper = employeeDomainMapper;
    }

    @Override
    public void createEmployeeDomain(EmployeeDomainCreateOrUpdateRequest employeeDomainCreateOrUpdateRequest) {
        EmployeeDomain employeeDomain = employeeDomainMapper.mapToEmployeeDomainEntity(employeeDomainCreateOrUpdateRequest);
        employeeDomainRepository.save(employeeDomain);
    }

    @Override
    public EmployeeDomainResponse findEmployeeDomainById(Long employeeDomainId) {
        return employeeDomainMapper.mapToEmployeeDomainResponse(employeeDomainRepository
                .findById(employeeDomainId)
                .orElseThrow(() -> new ResourceNotFoundException("No existing record found for employee domain!")));
    }

    @Override
    public Page<EmployeeDomainResponse> searchEmployeeDomain(String keyword, PageRequest pageRequest) {
        var qEmployeeDomain = QEmployeeDomain.employeeDomain;
        BooleanBuilder booleanBuilderPredicate = new BooleanBuilder()
                .and(qEmployeeDomain.archived.eq(false));
        if (Objects.nonNull(keyword)) {
            booleanBuilderPredicate.or(qEmployeeDomain.name.toLowerCase().contains(keyword.toLowerCase(Locale.ROOT)));
            booleanBuilderPredicate.or(qEmployeeDomain.description.toLowerCase().contains(keyword.toLowerCase(Locale.ROOT)));
        }
        return employeeDomainRepository.findAll(booleanBuilderPredicate, pageRequest)
                .map(employeeDomainMapper::mapToEmployeeDomainResponse);
    }

    @Override
    public void updateEmployeeDomain(Long employeeDomainId, EmployeeDomainCreateOrUpdateRequest employeeDomainCreateOrUpdateRequest) {
        employeeDomainRepository.findById(employeeDomainId).ifPresentOrElse(employeeDomain -> {
            employeeDomain.setName(employeeDomainCreateOrUpdateRequest.getName());
            employeeDomain.setDescription(employeeDomainCreateOrUpdateRequest.getDescription());
            employeeDomainRepository.save(employeeDomain);
        }, () -> {
            throw new ResourceNotFoundException("No existing record found for employee domain!");
        });
    }

    @Override
    public void archiveEmployeeDomain(Long employeeDomainId) {
        employeeDomainRepository.findById(employeeDomainId)
                .ifPresentOrElse(employeeDomain -> {
                    employeeDomain.setArchived(true);
                    employeeDomainRepository.save(employeeDomain);
                }, () -> {
                    throw new ResourceNotFoundException("Invalid employee domain id entered!");
                });
    }

}