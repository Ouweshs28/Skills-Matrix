package com.skillsmatrix.exception;

/**
 * @author akn
 */
public class UnauthorizedException extends RuntimeException {

    public UnauthorizedException(String message) {
        super(message);
    }

}