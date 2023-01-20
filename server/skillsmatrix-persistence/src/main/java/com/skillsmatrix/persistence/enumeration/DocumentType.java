package com.skillsmatrix.persistence.enumeration;

public enum DocumentType {
    CERTIFICATE("Certificate"),
    CV("CV"),
    SLIDE("Slide"),
    OTHER("Other");

    private final String label;

    DocumentType(String label) {
        this.label = label;
    }

    @Override
    public String toString() {
        return label;
    }

}