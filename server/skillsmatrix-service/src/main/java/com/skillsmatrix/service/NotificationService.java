package com.skillsmatrix.service;

import com.skillsmatrix.persistence.entity.Employee;

/**
 * @author ows
 */
public interface NotificationService {

    /**
     * @param employeeName  the name of the employee to review
     * @param reviewerName  the name of the reviewer
     * @param reviewerEmail the email of the reviewer
     * @param managerName   the name of the manager
     */
    void addNotificationReviewer(String employeeName, String reviewerName, String reviewerEmail, String managerName);

    /**
     * @param employee the {@link Employee}
     */
    void addNotificationManager(Employee employee);

}