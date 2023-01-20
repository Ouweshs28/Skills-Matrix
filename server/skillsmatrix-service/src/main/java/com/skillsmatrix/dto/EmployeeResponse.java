package com.skillsmatrix.dto;

import com.skillsmatrix.persistence.enumeration.EmploymentPosition;
import com.skillsmatrix.persistence.enumeration.Factory;
import com.skillsmatrix.persistence.enumeration.Gender;
import lombok.Data;

/**
 * @author zaf
 */
@Data
public class EmployeeResponse {

    private Long id;
    private String firstName;
    private String lastName;
    private Gender gender;
    private String email;
    private String visa;
    private Factory factory;
    private EmploymentPosition position;
    private ManagerResponse manager;
    private EmployeeDomainResponse employeeDomain;

}
