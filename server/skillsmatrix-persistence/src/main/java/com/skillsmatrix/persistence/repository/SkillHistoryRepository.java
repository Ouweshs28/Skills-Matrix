package com.skillsmatrix.persistence.repository;

import com.skillsmatrix.persistence.entity.SkillHistory;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SkillHistoryRepository extends AbstractRepository<SkillHistory> {

    Optional<SkillHistory> findFirstByEmployeeIdAndReviewerId(Long employeeId, Long reviewerId);

}