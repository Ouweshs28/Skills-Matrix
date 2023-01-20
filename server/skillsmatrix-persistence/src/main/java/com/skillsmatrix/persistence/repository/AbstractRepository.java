package com.skillsmatrix.persistence.repository;

import com.skillsmatrix.persistence.entity.AuditModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import org.springframework.data.repository.NoRepositoryBean;

/**
 * @author akn
 */
@NoRepositoryBean
public interface AbstractRepository<T extends AuditModel> extends JpaRepository<T, Long>, QuerydslPredicateExecutor<T> {

}