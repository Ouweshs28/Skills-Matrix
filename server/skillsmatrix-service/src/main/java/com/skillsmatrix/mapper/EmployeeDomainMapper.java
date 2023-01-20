package com.skillsmatrix.mapper;

import com.skillsmatrix.dto.EmployeeDomainCreateOrUpdateRequest;
import com.skillsmatrix.dto.EmployeeDomainResponse;
import com.skillsmatrix.persistence.entity.EmployeeDomain;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

/**
 * @author zaf
 */
@Mapper(componentModel = "spring")
public interface EmployeeDomainMapper {

    @Mapping(target = "createdOn", ignore = true)
    @Mapping(target = "updatedOn", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "archived", defaultValue = "false")
    EmployeeDomain mapToEmployeeDomainEntity(EmployeeDomainCreateOrUpdateRequest employeeDomainCreateOrUpdateRequest);

    EmployeeDomainResponse mapToEmployeeDomainResponse(EmployeeDomain employeeDomain);

}