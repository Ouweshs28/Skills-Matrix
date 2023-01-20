package com.skillsmatrix.mapper;

import com.skillsmatrix.dto.EmployeeCreateOrUpdateRequest;
import com.skillsmatrix.dto.EmployeeResponse;
import com.skillsmatrix.dto.ManagerResponse;
import com.skillsmatrix.persistence.entity.Employee;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface EmployeeMapper {

    @Mapping(target = "createdOn", ignore = true)
    @Mapping(target = "updatedOn", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "archived", defaultValue = "false")
    @Mapping(target = "employeeDomain", ignore = true)
    @Mapping(target = "employeeSkills", ignore = true)
    @Mapping(target = "manager", ignore = true)
    Employee mapToEmployeeEntity(EmployeeCreateOrUpdateRequest employeeCreateOrUpdateRequest);

    @Mapping(target = "createdOn", ignore = true)
    @Mapping(target = "updatedOn", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "archived", ignore = true)
    @Mapping(target = "employeeDomain", ignore = true)
    @Mapping(target = "employeeSkills", ignore = true)
    @Mapping(target = "manager", ignore = true)
    void mapToEmployeeEntity(@MappingTarget Employee employee, EmployeeCreateOrUpdateRequest employeeCreateOrUpdateRequest);

    EmployeeResponse mapToEmployeeResponse(Employee employee);

    ManagerResponse mapToManagerResponse(Employee employee);

}