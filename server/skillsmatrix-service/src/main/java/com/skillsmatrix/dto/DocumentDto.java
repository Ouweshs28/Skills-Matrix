package com.skillsmatrix.dto;

import com.skillsmatrix.persistence.enumeration.DocumentType;
import lombok.Data;

/**
 * @author zaf
 */
@Data
public class DocumentDto {

    private Long id;
    private Long employeeId;
    private Long employeeSkillId;
    private String name;
    private String fileName;
    private String filePath;
    private DocumentType documentType;

}