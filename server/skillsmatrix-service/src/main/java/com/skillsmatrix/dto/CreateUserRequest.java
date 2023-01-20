package com.skillsmatrix.dto;

import com.skillsmatrix.persistence.enumeration.Gender;
import lombok.Getter;
import lombok.Setter;

/**
 * @author akn
 */
@Getter
@Setter
public class CreateUserRequest {

    private Long id;

    private Gender genderEnum;

}