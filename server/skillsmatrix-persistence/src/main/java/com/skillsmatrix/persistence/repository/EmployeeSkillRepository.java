package com.skillsmatrix.persistence.repository;

import com.skillsmatrix.persistence.entity.Employee;
import com.skillsmatrix.persistence.entity.EmployeeSkill;
import com.skillsmatrix.persistence.entity.Skill;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EmployeeSkillRepository extends AbstractRepository<EmployeeSkill> {

    Optional<EmployeeSkill> findEmployeeSkillByEmployeeAndSkill(Employee employee, Skill skill);

}