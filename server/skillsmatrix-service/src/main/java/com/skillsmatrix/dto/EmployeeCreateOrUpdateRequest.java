package com.skillsmatrix.dto;

import com.skillsmatrix.persistence.enumeration.EmploymentPosition;
import com.skillsmatrix.persistence.enumeration.Factory;
import com.skillsmatrix.persistence.enumeration.Gender;
import lombok.Data;

@Data
public class EmployeeCreateOrUpdateRequest {

    private String firstName;
    private String lastName;
    private Gender gender;
    private String email;
    public String visa;
    private Factory factory;
    private EmploymentPosition position;
    private Long managerId;
    private Long employeeDomainId;

}
