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
  UNCATEGORIZED_EXCEPTION(9999, "Unauthorized exception", HttpStatus.INTERNAL_SERVER_ERROR),
  KEY_INVALID(9998, "Invalid key", HttpStatus.BAD_REQUEST),

  //  Exists - Bad Request
  ACTION_EXISTED(400, "Permission already exists", HttpStatus.BAD_REQUEST),
  RESOURCE_EXISTED(400, "Resource already exists", HttpStatus.BAD_REQUEST),
  TYPE_EXISTED(400, "Type already exists", HttpStatus.BAD_REQUEST),
  ROLE_EXISTED(400, "Role already exists", HttpStatus.BAD_REQUEST),
  EMAIL_EXISTED(400, "Email already exists", HttpStatus.BAD_REQUEST),
  STREET_EXIST(400, "Street already exists", HttpStatus.BAD_REQUEST),
  FACILITY_EXIST(400, "Facility already exists", HttpStatus.BAD_REQUEST),
  DOCUMENTS_EXISTED(400, "Document Hotel already exists",
        HttpStatus.BAD_REQUEST),

  // Field Invalid - 400
  EMAIL_INVALID(400, "Email is not valid", HttpStatus.BAD_REQUEST),
  DONT_DELETE_SA(400, "Cannot delete SA", HttpStatus.BAD_REQUEST),
  FIELD_INVALID(400, "{field} invalid", HttpStatus.BAD_REQUEST),

  // USED
  POLICY_USED(400, "The policy has already been used", HttpStatus.BAD_REQUEST),

  // CANNOT BE UPDATE
  HOTEL_APPROVED(400, "Cannot update a hotel that has already been approved", HttpStatus.BAD_REQUEST),

  // Not null
  POLICY_NOT_NULL(400, "Policy must not be null", HttpStatus.BAD_REQUEST),
  HOTEL_NOT_NULL(400, "Hotel must not be null", HttpStatus.BAD_REQUEST),

  //Exceeds
  IMG_EXCEEDS(400, "Maximum of {maxSize} images", HttpStatus.BAD_REQUEST),
  IMG_SIZE_EXCEEDS(400, "Maximum upload size 1MB exceeded", HttpStatus.BAD_REQUEST),

  // Not Active - 400
  ROLE_NOT_ACTIVE(400, "Role is not active", HttpStatus.BAD_REQUEST),
  USER_NOT_ACTIVE(400, "User is not active", HttpStatus.BAD_REQUEST),
  ACTION_NOT_ACTIVE(400, "Permission is not active", HttpStatus.BAD_REQUEST),
  RESOURCE_NOT_ACTIVE(400, "Resource is not active", HttpStatus.BAD_REQUEST),
  MAPPING_UR_NOT_ACTIVE(400, "Mapping User Role is not active", HttpStatus.BAD_REQUEST),
  MAPPING_RA_NOT_ACTIVE(400, "Mapping Resource Permission is not active", HttpStatus.BAD_REQUEST),

  //  NOT EMPTY - 400
  FIELD_NOT_EMPTY(400, "{field} cannot be empty", HttpStatus.BAD_REQUEST),
  AVATAR_NOT_EMPTY(400, "Avatar cannot be empty", HttpStatus.BAD_REQUEST),
  CREATION_FAILED(400, "Creation failed", HttpStatus.BAD_REQUEST),
  UPDATED_FAILED(400, "Updated failed", HttpStatus.BAD_REQUEST),


  //  Invalid - 401
  UNAUTHENTICATED(401, "Unauthenticated", HttpStatus.UNAUTHORIZED),
  AUTHENTICATION_FAILED(401, "Invalid email or password", HttpStatus.UNAUTHORIZED),
  ACCESS_DENIED(403, "Access Denied", HttpStatus.FORBIDDEN),

  //  Not Found - 404
  ACTION_NOTFOUND(404, "Permission Not Found", HttpStatus.NOT_FOUND),
  PROVINCE_NOTFOUND(404, "Province Not Found", HttpStatus.NOT_FOUND),
  WARD_NOTFOUND(404, "Ward Not Found", HttpStatus.NOT_FOUND),
  USER_NOTFOUND(404, "User Not Found", HttpStatus.NOT_FOUND),
  AUTH_LOGIN_NOTFOUND(404, "Auth Not Found", HttpStatus.NOT_FOUND),
  HOTEL_NOTFOUND(404, "Hotel Not Found", HttpStatus.NOT_FOUND),
  ROLE_NOTFOUND(404, "Role Not Found", HttpStatus.NOT_FOUND),
  RESOURCE_NOTFOUND(404, "Resource Not Found", HttpStatus.NOT_FOUND),
  APPROVE_NOTFOUND(404, "Approve Hotel Not Found", HttpStatus.NOT_FOUND),
  PERMISSION_NOTFOUND(404, "Permission Not Found", HttpStatus.NOT_FOUND),
  STREET_NOTFOUND(404, "Street Not Found", HttpStatus.NOT_FOUND),
  POLICY_NOTFOUND(404, "Policy Not Found", HttpStatus.NOT_FOUND),
  DISTRICT_NOTFOUND(404, "District Not Found", HttpStatus.NOT_FOUND),
  ADDRESS_NOTFOUND(404, "Address Not Found", HttpStatus.NOT_FOUND),
  IMAGE_NOTFOUND(404, "Image Not Found", HttpStatus.NOT_FOUND),
  TYPE_NOTFOUND(404, "Type Not Found", HttpStatus.NOT_FOUND),
  FACILITY_NOTFOUND(404, "Facility Not Found", HttpStatus.NOT_FOUND),
  DOCUMENTS_TYPE_NOTFOUND(404, "Document Hotel Not Found",
        HttpStatus.NOT_FOUND),
  DOCUMENTS_NOTFOUND(404, "Document Not Found", HttpStatus.NOT_FOUND),

  // Mapping Not found - 404
  MAPPING_UR_NOTFOUND(404, "Mapping User Role Not Found", HttpStatus.NOT_FOUND),
  MAPPING_RA_NOTFOUND(404, "Mapping Resource Permission Not Found", HttpStatus.NOT_FOUND),
  MAPPING_IMG_NOTFOUND(404, "Mapping Hotel Img Not Found", HttpStatus.NOT_FOUND),
  MAPPING_HOTEL_NOTFOUND(404, "Mapping Hotel Not Found", HttpStatus.NOT_FOUND);


  int code;
  String message;
  HttpStatusCode statusCode;

}
