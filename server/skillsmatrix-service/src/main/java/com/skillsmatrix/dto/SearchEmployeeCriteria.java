package com.skillsmatrix.dto;

import com.skillsmatrix.persistence.enumeration.Factory;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class SearchEmployeeCriteria {

    private String employeeName;
    private List<SearchSkillLevel> skillLevel;
    private List<Long> domainList;
    private Factory factory;
    private List<Long> employeeId;
    private Long managerId;

}
