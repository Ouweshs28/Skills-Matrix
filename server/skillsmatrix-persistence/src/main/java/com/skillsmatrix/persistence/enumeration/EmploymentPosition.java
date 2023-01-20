package com.skillsmatrix.persistence.enumeration;

public enum EmploymentPosition {
    BA_ASSOCIATE_BA("Associate Business Analyst"),
    BA_SENIOR_BA("Senior Business Analyst"),

    ENGINEERING_TRAINEE("Trainee"),
    ENGINEERING_ASSOCIATE_SOFTWARE_ENGINEER("Associate Software Engineer"),
    ENGINEERING_SOFTWARE_ENGINEER("Software Engineer"),
    ENGINEERING_SENIOR_SOFTWARE_ENGINEER("Senior Software Engineer"),
    ENGINEERING_ASSOCIATE_ARCHITECT("Associate Architect"),
    ENGINEERING_ARCHITECT("Architect"),
    ENGINEERING_SENIOR_ARCHITECT("Senior Architect"),

    EXPERT_ASSOCIATE_EXPERT("Associate Expert"),
    EXPERT_EXPERT("Expert"),
    EXPERT_SENIOR_EXPERT("Senior Expert"),

    MANAGEMENT_ASSOCIATE_PROJECT_MANAGER("Associate Project Manager"),
    MANAGEMENT_PROJECT_MANAGER("Project Manager"),
    MANAGEMENT_SENIOR_MANAGER("Senior Manager"),

    QA_ASSOCIATE_QA("Associate QA"),
    QA_QA("QA"),
    QA_SENIOR_QA("Senior QA");

    private final String label;

    EmploymentPosition(String label) {
        this.label = label;
    }

    @Override
    public String toString() {
        return label;
    }

}