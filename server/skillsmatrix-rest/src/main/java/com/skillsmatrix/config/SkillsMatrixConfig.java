package com.skillsmatrix.config;

import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

/**
 * @author akn
 */
@Configuration
@ComponentScan({"com.skillsmatrix"})
@EnableJpaRepositories("com.skillsmatrix.persistence.repository")
@EntityScan("com.skillsmatrix.persistence.entity")
@EnableJpaAuditing
public class SkillsMatrixConfig {

}
