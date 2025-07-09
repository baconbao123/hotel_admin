package com.hotel.webapp.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public enum ErrorCode {
  // --------------------------- RUNTIME ---------------------------
  UNCATEGORIZED_EXCEPTION(9999, "An unexpected error occurred. Please check server logs for details",
        HttpStatus.INTERNAL_SERVER_ERROR),

  // --------------------------- BAD_REQUEST ---------------------------
  COMMON_400(400, "%s", HttpStatus.BAD_REQUEST),

  // Exists
  FIELD_EXISTED(400, "%s already exists", HttpStatus.BAD_REQUEST),

  // Field Invalid
  DONT_DELETE_SA(400, "Cannot delete SA", HttpStatus.BAD_REQUEST),
  FIELD_INVALID(422, "{field} invalid", HttpStatus.UNPROCESSABLE_ENTITY),
  REGEX_INVALID(422, "{notice} ", HttpStatus.UNPROCESSABLE_ENTITY),

  // USED
  FIELD_USED(400, "%s has already been used", HttpStatus.BAD_REQUEST),

  // Not null

  // Exceeds
  IMG_EXCEEDS(400, "Maximum of {maxSize} images", HttpStatus.BAD_REQUEST),
  IMG_SIZE_EXCEEDS(400, "Maximum upload size 100MB exceeded", HttpStatus.BAD_REQUEST),

  // Not Active
  NOT_ACTIVE(400, "%s is not active", HttpStatus.BAD_REQUEST),

  //  NOT EMPTY
  FIELD_NOT_EMPTY(422, "{field} is required", HttpStatus.UNPROCESSABLE_ENTITY),
  IMAGES_SIZE_EXCEEDED(422, "{field} in invalid. Minium is 100 and maximum allowed is {0}",
        HttpStatus.UNPROCESSABLE_ENTITY),

  // TOKEN
  EXPIRED_TOKEN(400, "Expired token", HttpStatus.BAD_REQUEST),

  // INPUT DATA FAILED
  CREATION_FAILED(400, "Creation failed", HttpStatus.BAD_REQUEST),
  UPDATED_FAILED(400, "Updated failed", HttpStatus.BAD_REQUEST),

  // ---------------------------  AUTHENTICATION ---------------------------
  UNAUTHENTICATED(401, "Unauthenticated", HttpStatus.UNAUTHORIZED),
  AUTHENTICATION_FAILED(401, "Invalid email or password", HttpStatus.UNAUTHORIZED),
  ACCESS_DENIED(403, "Access Denied", HttpStatus.FORBIDDEN),

  // ---------------------------  NOT FOUND ---------------------------
  NOT_FOUND(404, "%s Not Found", HttpStatus.NOT_FOUND);


  int code;
  String message;
  HttpStatusCode statusCode;

}
