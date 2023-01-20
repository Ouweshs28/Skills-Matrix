package com.skillsmatrix.persistence.enumeration;

public enum Factory {
    ENGINEERING("Engineering"),
    IPENSION("iPension");

    private final String label;

    Factory(String label) {
        this.label = label;
    }

    @Override
    public String toString() {
        return label;
    }

}