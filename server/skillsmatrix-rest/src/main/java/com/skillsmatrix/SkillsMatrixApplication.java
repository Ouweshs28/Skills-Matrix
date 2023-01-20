package com.skillsmatrix;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * @author akn
 */
@SpringBootApplication
@EnableScheduling
public class SkillsMatrixApplication {

    public static void main(String[] args) {
        SpringApplication.run(SkillsMatrixApplication.class, args);
    }

}
