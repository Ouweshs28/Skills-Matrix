package com.skillsmatrix.dto;

import com.skillsmatrix.persistence.enumeration.SkillLevel;
import com.skillsmatrix.persistence.enumeration.SkillStatus;
import lombok.Data;

/**
 * @author ows
 */
@Data
public class SkillHistoryResponse {

    private Long id;
    private Long skillId;
    private String skillName;
    private String skillDescription;
    private String employeeDomainName;
    private String skillCategoryName;
    private SkillLevel skillLevel;
    private SkillStatus status;
    private String comments;
    private Long employeeId;
    private Long reviewerId;
    private String reviewerName;

}
