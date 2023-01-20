package com.skillsmatrix;

import com.skillsmatrix.exception.BadRequestException;
import com.skillsmatrix.exception.DataDuplicationException;
import com.skillsmatrix.exception.UnauthorizedException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.web.servlet.error.ErrorAttributes;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.lang.Nullable;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import javax.validation.ConstraintViolationException;
import java.util.Map;

import static org.springframework.boot.web.error.ErrorAttributeOptions.Include.BINDING_ERRORS;
import static org.springframework.boot.web.error.ErrorAttributeOptions.Include.MESSAGE;
import static org.springframework.boot.web.error.ErrorAttributeOptions.of;

/**
 * @author ril
 */
@Slf4j
@ControllerAdvice("com.skillsmatrix.rest")
public class SkillMatrixResponseEntityExceptionHandler extends ResponseEntityExceptionHandler {
    private final ErrorAttributes errorAttributes;

    public SkillMatrixResponseEntityExceptionHandler(ErrorAttributes errorAttributes) {
        super();
        this.errorAttributes = errorAttributes;
    }

    @ExceptionHandler
    public ResponseEntity<Object> handleConstraintViolationException(ConstraintViolationException e, WebRequest request) {
        return handleExceptionInternal(e, new HttpHeaders(), HttpStatus.BAD_REQUEST, request);
    }

    @ExceptionHandler
    public ResponseEntity<Object> handleDataDuplicationException(DataDuplicationException e, WebRequest request) {
        return handleExceptionInternal(e, new HttpHeaders(), HttpStatus.CONFLICT, request);
    }

    @ExceptionHandler
    public ResponseEntity<Object> handleBadRequestException(BadRequestException e, WebRequest request) {
        return handleExceptionInternal(e, new HttpHeaders(), HttpStatus.BAD_REQUEST, request);
    }

    @ExceptionHandler
    public ResponseEntity<Object> handleUnauthorizedException(UnauthorizedException e, WebRequest request) {
        return handleExceptionInternal(e, new HttpHeaders(), HttpStatus.UNAUTHORIZED, request);
    }

    @Override
    @NonNull
    protected ResponseEntity<Object> handleExceptionInternal(@NonNull Exception ex, @Nullable Object additionalBody, @NonNull HttpHeaders headers, HttpStatus status, @NonNull WebRequest request) {
        Map<String, Object> body = errorAttributes.getErrorAttributes(request, of(BINDING_ERRORS, MESSAGE));
        body.put("error", status.getReasonPhrase());
        body.put("path", request.getDescription(false));
        body.put("status", status.value());

        if (additionalBody instanceof Map) {
            Map<?, ?> additionalBodyAsMap = (Map<?, ?>) additionalBody;
            additionalBodyAsMap.forEach((key, value) -> body.put(String.valueOf(key), value));
        }
        return super.handleExceptionInternal(ex, body, headers, status, request);
    }

    private ResponseEntity<Object> handleExceptionInternal(Exception ex, HttpHeaders headers, HttpStatus status, WebRequest request) {
        return this.handleExceptionInternal(ex, null, headers, status, request);
    }

}