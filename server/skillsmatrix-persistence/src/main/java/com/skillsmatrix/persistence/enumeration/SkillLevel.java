package com.skillsmatrix.persistence.enumeration;

public enum SkillLevel {
    P0("Novice"),
    P1("Beginner"),
    P2("Proficient"),
    P3("Advanced"),
    P4("Expert");

    private final String label;

    SkillLevel(String label) {
        this.label = label;
    }

    @Override
    public String toString() {
        return label;
    }

}