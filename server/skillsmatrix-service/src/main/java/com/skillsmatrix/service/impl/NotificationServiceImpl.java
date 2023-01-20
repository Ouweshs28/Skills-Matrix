package com.skillsmatrix.service.impl;

import com.skillsmatrix.persistence.entity.Employee;
import com.skillsmatrix.persistence.entity.Notification;
import com.skillsmatrix.persistence.repository.NotificationRepository;
import com.skillsmatrix.service.NotificationService;
import com.skillsmatrix.persistence.enumeration.NotificationStatus;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring5.SpringTemplateEngine;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import javax.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;

import static com.skillsmatrix.persistence.entity.QNotification.notification;

@Service
@Transactional
public class NotificationServiceImpl implements NotificationService {

    private static final Logger LOGGER = LoggerFactory.getLogger(NotificationServiceImpl.class);

    private final JavaMailSender javaMailSender;
    private final NotificationRepository notificationRepository;
    private final SpringTemplateEngine thymeleafTemplateEngine;

    public NotificationServiceImpl(JavaMailSender javaMailSender, NotificationRepository notificationRepository, SpringTemplateEngine thymeleafTemplateEngine) {
        this.javaMailSender = javaMailSender;
        this.notificationRepository = notificationRepository;
        this.thymeleafTemplateEngine = thymeleafTemplateEngine;
    }

    @Override
    public void addNotificationReviewer(String employeeName, String reviewerName, String reviewerEmail, String managerName) {
        Context thymeleafContext = new Context();
        thymeleafContext.setVariables(Map.of(
                "reviewerName", reviewerName,
                "employeeName", employeeName,
                "managerName", managerName));

        Notification notification = Notification.builder()
                .senderName(employeeName)
                .recipientEmail(reviewerEmail)
                .recipientName(managerName)
                .subject("NEW EMPLOYEE TO REVIEW")
                .status(NotificationStatus.NEW)
                .content(thymeleafTemplateEngine.process("templates/reviewer-email.html", thymeleafContext))
                .build();
        notificationRepository.save(notification);
    }

    @Override
    public void addNotificationManager(Employee employee) {
        Optional<Notification> pendingNotification = notificationRepository
                .findOne(notification.recipientEmail.eq(employee.getManager().getEmail())
                        .and(notification.senderName.containsIgnoreCase(employee.getVisa()))
                        .and(notification.updatedOn.after(LocalDateTime.now().minusMonths(3L))));

        if (pendingNotification.isPresent()) {
            return;
        }

        Context thymeleafContext = new Context();
        thymeleafContext.setVariables(Map.of(
                "employeeName", employee.getVisa(),
                "managerName", employee.getManager().getEmail()));

        Notification notification = Notification.builder()
                .senderName(employee.getVisa())
                .recipientName(employee.getManager().getVisa())
                .recipientEmail(employee.getManager().getEmail())
                .subject(employee.getVisa() + " updated his skills")
                .status(NotificationStatus.NEW)
                .content(thymeleafTemplateEngine.process("templates/manager-email.html", thymeleafContext))
                .build();
        notificationRepository.save(notification);
    }

    @Scheduled(cron = "0 0/30 * * * *")
    public void sendEmails() {
        notificationRepository.findAll(notification.status.eq(NotificationStatus.NEW))
                .forEach(this::sendEmail);
    }

    private void sendEmail(Notification notification) {
        MimeMessage message = javaMailSender.createMimeMessage();
        MimeMessageHelper mimeMessageHelper = null;

        try {
            mimeMessageHelper = new MimeMessageHelper(message, true);
        } catch (MessagingException e) {
            LOGGER.error("error has occurred: ", e);
            return;
        }

        try {
            if (Objects.nonNull(notification.getRecipientEmail())) {
                mimeMessageHelper.setTo(notification.getRecipientEmail());
            }
            mimeMessageHelper.setFrom("skillsmatrix@support.mu");
            mimeMessageHelper.setSubject(notification.getSubject());
            mimeMessageHelper.setText("", notification.getContent());
        } catch (MessagingException e) {
            LOGGER.error("error has occurred: ", e);
        }

        javaMailSender.send(message);
        notification.setStatus(NotificationStatus.SENT);
        notificationRepository.save(notification);
    }

}
