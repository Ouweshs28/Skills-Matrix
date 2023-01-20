package com.skillsmatrix.persistence.repository;

import com.skillsmatrix.persistence.entity.Employee;
import com.skillsmatrix.persistence.enumeration.SkillStatus;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeRepository extends AbstractRepository<Employee> {

    Optional<Employee> findByVisa(String visa);

    @Query("select distinct sh.reviewer from SkillHistory sh where sh.employee.id = :employeeId " +
            "and sh.reviewer.id <> :employeeId " +
            "and sh.status = :skillStatus")
    List<Employee> findAssignedReviewersByEmployeeId(@Param("employeeId") Long employeeId,
                                                     @Param("skillStatus") SkillStatus skillStatus);

    @Query("Select distinct sh.employee from SkillHistory sh where sh.reviewer.id = :reviewerId " +
            "and sh.employee.id <> :reviewerId " +
            "and LOWER(concat(sh.employee.firstName,sh.employee.lastName)) like %:keyword% " +
            "and sh.status = :skillStatus")
    List<Employee> findEmployeesToReview(@Param("reviewerId") Long reviewerId,
                                         @Param("keyword") String keyword,
                                         @Param("skillStatus") SkillStatus skillStatus);

}