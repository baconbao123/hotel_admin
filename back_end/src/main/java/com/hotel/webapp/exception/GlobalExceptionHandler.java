package com.hotel.webapp.exception;

import com.hotel.webapp.dto.response.ApiResponse;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authorization.AuthorizationDeniedException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

  @ExceptionHandler(value = Exception.class)
  ResponseEntity<ApiResponse> runtimeExceptionHandler(Exception e) {
    ApiResponse apiResponse = new ApiResponse();
    apiResponse.setCode(ErrorCode.UNCATEGORIZED_EXCEPTION.getCode());
    apiResponse.setMessage(ErrorCode.UNCATEGORIZED_EXCEPTION.getMessage());
    return ResponseEntity.status(ErrorCode.UNCATEGORIZED_EXCEPTION.getCode()).body(apiResponse);
  }

  @ExceptionHandler(value = AppException.class)
  ResponseEntity<ApiResponse> appExceptionHandler(AppException e) {
    ErrorCode errorCode = e.getErrorCode();
    ApiResponse apiResponse = new ApiResponse();
    apiResponse.setCode(errorCode.getCode());
    apiResponse.setMessage(e.getMessage());
    return ResponseEntity.status(errorCode.getStatusCode()).body(apiResponse);
  }

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<ApiResponse> handleValidation(MethodArgumentNotValidException e) {
    Map<String, String> errorMessages = new HashMap<>();
    ErrorCode errorCode = ErrorCode.UNCATEGORIZED_EXCEPTION;

    for (FieldError fieldError : e.getBindingResult().getFieldErrors()) {
      String field = fieldError.getField();
      String defaultMessage = fieldError.getDefaultMessage();
      String finalMessage;

      try {
        errorCode = ErrorCode.valueOf(defaultMessage);
        finalMessage = errorCode.getMessage();
      } catch (IllegalArgumentException ex) {
        if (defaultMessage != null && defaultMessage.endsWith("_NOT_EMPTY")) {
          errorCode = ErrorCode.FIELD_NOT_EMPTY;
          String fieldName = extractFieldName(defaultMessage, "_NOT_EMPTY");
          finalMessage = errorCode.getMessage().replace("{field}", fieldName);
        } else if (defaultMessage != null && defaultMessage.endsWith("_SIZE_EXCEEDED")) {
          errorCode = ErrorCode.IMAGES_SIZE_EXCEEDED;
          String fieldName = extractFieldName(defaultMessage, "_SIZE_EXCEEDED");
          finalMessage = errorCode.getMessage()
                                  .replace("{field}", fieldName)
                                  .replace("{0}", String.valueOf(
                                        fieldError.getRejectedValue() instanceof List<?> list
                                              ? list.size()
                                              : "unknown"));
        } else if (defaultMessage != null && defaultMessage.endsWith("_NOTICE")) {
          errorCode = ErrorCode.REGEX_INVALID;
          String fieldName = extractFieldName(defaultMessage, "_NOTICE");
          finalMessage = errorCode.getMessage().replace("{notice}", fieldName);
        } else {
          errorCode = ErrorCode.UNCATEGORIZED_EXCEPTION;
          finalMessage = errorCode.getMessage();
        }
      }

      errorMessages.put(field, finalMessage);
    }

    ApiResponse response = new ApiResponse();
    response.setCode(errorCode.getCode());
    response.setMessage("Validation failed");
    response.setErrorMessages(errorMessages);

    return ResponseEntity.status(errorCode.getStatusCode()).body(response);
  }

  @ExceptionHandler(ConstraintViolationException.class)
  public ResponseEntity<ApiResponse> handleConstraintViolation(ConstraintViolationException e) {
    Map<String, String> errorMessages = new HashMap<>();
    for (ConstraintViolation<?> violation : e.getConstraintViolations()) {
      String field = violation.getPropertyPath().toString();
      String message = violation.getMessage();
      errorMessages.put(field, message);
    }
    ApiResponse response = new ApiResponse();
    response.setCode(ErrorCode.FIELD_NOT_EMPTY.getCode());
    response.setMessage("Validation failed");
    response.setErrorMessages(errorMessages);
    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
  }

  @ExceptionHandler(value = AuthorizationDeniedException.class)
  ResponseEntity<ApiResponse> authorizationDeniedExceptionHandler(AuthorizationDeniedException e) {
    ApiResponse apiResponse = new ApiResponse();
    apiResponse.setCode(ErrorCode.ACCESS_DENIED.getCode());
    apiResponse.setMessage(ErrorCode.ACCESS_DENIED.getMessage());
    return ResponseEntity.status(ErrorCode.ACCESS_DENIED.getStatusCode()).body(apiResponse);
  }

  @ExceptionHandler(value = MaxUploadSizeExceededException.class)
  ResponseEntity<ApiResponse> handleMaxSizeExceeds(MaxUploadSizeExceededException e) {
    ApiResponse apiResponse = new ApiResponse();
    apiResponse.setCode(ErrorCode.IMG_SIZE_EXCEEDS.getCode());
    apiResponse.setMessage(ErrorCode.IMG_SIZE_EXCEEDS.getMessage());
    return ResponseEntity.status(ErrorCode.IMG_SIZE_EXCEEDS.getStatusCode()).body(apiResponse);
  }

  private String extractFieldName(String defaultMess, String suffix) {
    String rawFieldName = defaultMess.replace(suffix, "");
    return rawFieldName.substring(0, 1).toUpperCase() + rawFieldName.substring(1).toLowerCase();
  }
}