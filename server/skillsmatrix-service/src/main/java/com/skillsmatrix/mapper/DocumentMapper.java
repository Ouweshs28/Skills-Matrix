package com.skillsmatrix.mapper;

import com.skillsmatrix.dto.DocumentDto;
import com.skillsmatrix.persistence.entity.Document;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

/**
 * @author zaf
 */
@Mapper(componentModel = "spring")
public interface DocumentMapper {

    @Mapping(target = "createdOn", ignore = true)
    @Mapping(target = "updatedOn", ignore = true)
    @Mapping(target = "employee", ignore = true)
    @Mapping(target = "employeeSkill", ignore = true)
    Document mapToDocumentEntity(DocumentDto documentDto);

    @Mapping(target = "employeeId", source = "employee.id")
    @Mapping(target = "employeeSkillId", source = "employeeSkill.id")
    DocumentDto mapToDocumentDto(Document document);

}