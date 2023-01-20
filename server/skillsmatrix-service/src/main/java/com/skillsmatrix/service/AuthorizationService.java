package com.skillsmatrix.service;

/**
 * @author akn
 */
public interface AuthorizationService {

    Long getUserId();

    void verifyIfManagerHasAccess(Long employeeId);

    void verifyIfReviewerHasAccess(Long employeeId);

}