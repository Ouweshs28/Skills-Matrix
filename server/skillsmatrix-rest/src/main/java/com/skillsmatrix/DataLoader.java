package com.skillsmatrix;


import com.skillsmatrix.persistence.entity.Employee;
import com.skillsmatrix.persistence.entity.EmployeeDomain;
import com.skillsmatrix.persistence.entity.Skill;
import com.skillsmatrix.persistence.entity.SkillCategory;
import com.skillsmatrix.persistence.enumeration.EmploymentPosition;
import com.skillsmatrix.persistence.enumeration.Factory;
import com.skillsmatrix.persistence.enumeration.Gender;
import com.skillsmatrix.persistence.repository.EmployeeDomainRepository;
import com.skillsmatrix.persistence.repository.EmployeeRepository;
import com.skillsmatrix.persistence.repository.SkillCategoryRepository;
import com.skillsmatrix.persistence.repository.SkillRepository;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;

import java.util.List;


/**
 * @author ows
 */

//@Component
public class DataLoader implements ApplicationRunner {

    private final EmployeeDomainRepository employeeDomainRepository;
    private final SkillCategoryRepository skillCategoryRepository;
    private final SkillRepository skillRepository;
    private final EmployeeRepository employeeRepository;

    public DataLoader(EmployeeDomainRepository employeeDomainRepository,
                      SkillCategoryRepository skillCategoryRepository,
                      SkillRepository skillRepository,
                      EmployeeRepository employeeRepository) {
        this.employeeDomainRepository = employeeDomainRepository;
        this.skillCategoryRepository = skillCategoryRepository;
        this.skillRepository = skillRepository;
        this.employeeRepository = employeeRepository;
    }

    @Override
    public void run(ApplicationArguments args) throws Exception {
        // Domains

        EmployeeDomain frontendDomain = new EmployeeDomain("Frontend", "Front-end web development is the development of the graphical user interface of a website, through the use of HTML, CSS, and JavaScript, so that users can view and interact with that website.");
        frontendDomain = employeeDomainRepository.save(frontendDomain);
        EmployeeDomain javaDomain = new EmployeeDomain("Java", "Developer in JAVA");
        javaDomain = employeeDomainRepository.save(javaDomain);
        EmployeeDomain management = new EmployeeDomain("Management", "A manager");
        management = employeeDomainRepository.save(management);

        List<EmployeeDomain> employeeDomainList = List.of(
                new EmployeeDomain("Business Analysis", "A business analyst is a person who analyzes and documents the market environment, processes, or systems of businesses."),
                new EmployeeDomain("Mobile", "Mobile development"),
                new EmployeeDomain(".Net", ".Net developer"),
                new EmployeeDomain("UX", "User experience (UX) design is the process design teams use to create products that provide meaningful and relevant experiences to users."),
                new EmployeeDomain("Other", "Other domains"));
        employeeDomainRepository.saveAll(employeeDomainList);

        // Skill Categories

        SkillCategory developmentCategory = new SkillCategory("Development", "Software development is the process of conceiving, specifying, designing, programming, documenting, testing, and bug fixing involved in creating and maintaining applications, frameworks, or other software components.");
        developmentCategory = skillCategoryRepository.save(developmentCategory);

        SkillCategory frameworkCategory = new SkillCategory("Framework", "Software, providing generic functionality, can be selectively changed by additional user-written code, thus providing application-specific software.");
        frameworkCategory = skillCategoryRepository.save(frameworkCategory);

        SkillCategory programmingLanguageCategory = new SkillCategory("Programming Language", "A programming language is a formal language comprising a set of strings that produce various kinds of machine code output.");
        programmingLanguageCategory = skillCategoryRepository.save(programmingLanguageCategory);

        List<SkillCategory> skillCategoryList = List.of(
                new SkillCategory("Architecture", "research and decision-making process that identifies the scope of work to be designed"),
                new SkillCategory("CI/CD", "In software engineering, CI/CD or CICD is the combined practices of continuous integration and either continuous delivery or continuous deployment."),
                new SkillCategory("Cloud", "Cloud computing is the on-demand availability of computer system resources."),
                new SkillCategory("Databases", "database is an organized collection of data stored and accessed electronically from a computer system. Where databases are more complex they are often developed using formal design and modeling techniques."),
                new SkillCategory("Infrastructure", "Designs and maintains the firm's operating systems, authentication systems, databases, virtualization infrastructure, core network services, and messaging and endpoints"),
                new SkillCategory("Project Management", "Project management is the process of leading the work of a team to achieve all project goals within the given constraints."),
                new SkillCategory("Soft Skill", "Soft skills are character traits and interpersonal skills that characterize a person's relationships with other peopleSoft skills are character traits and interpersonal skills that characterize a person's relationships with other people"),
                new SkillCategory("Version Control", "In software engineering, version control is a class of systems responsible for managing changes to computer programs, documents, large web sites, or other collections of information."));
        skillCategoryRepository.saveAll(skillCategoryList);

        // Skills

        skillRepository.saveAll(List.of(
                new Skill(frontendDomain, programmingLanguageCategory, "CSS", "Stylesheet to style web pages"),
                new Skill(javaDomain, developmentCategory, "REST", "RESTFul api, and web services in general, are a way to abstract back ends from front end developpers"),
                new Skill(javaDomain, frameworkCategory, "Java FX", "Java FX Framework to develop UI"),
                new Skill(javaDomain, frameworkCategory, "JACP FW", "JACP FW to develop UI"),
                new Skill(javaDomain, developmentCategory, " Grpc", "Google Remote Procedure Call is an open source remote procedure"),
                new Skill(javaDomain, developmentCategory, "SOAP", "SOAP Framework"),
                new Skill(javaDomain, frameworkCategory, "Swing", "Java Swing FW to devlop Front End"),
                new Skill(javaDomain, frameworkCategory, "JPA", "Spring Boot JPA is a Java specification for managing relational data in Java applications"),
                new Skill(javaDomain, frameworkCategory, "Hibernate", "Spring Hibernate"),
                new Skill(javaDomain, frameworkCategory, "Spring Dependency injection + AOP", "Design Principle in Spring"),
                new Skill(javaDomain, frameworkCategory, "Spring Boot", "Spring Boot framework"),
                new Skill(javaDomain, frameworkCategory, "Spring Security", "Implementing security using Spring"),
                new Skill(javaDomain, frameworkCategory, "Spring Cloud", "Implantation of Cloud using Spring"),
                new Skill(javaDomain, frameworkCategory, "Spring Data", "Manipulation of data using Spring"),
                new Skill(javaDomain, frameworkCategory, "Spring config server", "Configuration of Spring Severs"),
                new Skill(javaDomain, frameworkCategory, "Spring Profiles", "Configuration of Spring Profiles"),
                new Skill(javaDomain, frameworkCategory, "Spring Streams", "Using Spring Steam API"),
                new Skill(javaDomain, frameworkCategory, "Spring Transaction", "Using Spring Transactions"),
                new Skill(javaDomain, frameworkCategory, "LEAF", "Leaf Framework"),
                new Skill(javaDomain, frameworkCategory, "EJB", "EJB Framework"),
                new Skill(javaDomain, frameworkCategory, "JMS", "The Jakarta Messaging API is a Java application programming interface for message-oriented middleware"),
                new Skill(javaDomain, programmingLanguageCategory, "Java 8", "Java Programming Language")

        ));

        employeeRepository.save(new Employee("Ouwesh", "Seeroo", Gender.MALE, "ouweshseeroo@gmail.com", "ouweshs28", Factory.ENGINEERING, EmploymentPosition.ENGINEERING_ASSOCIATE_SOFTWARE_ENGINEER, null, javaDomain));
    }
}
