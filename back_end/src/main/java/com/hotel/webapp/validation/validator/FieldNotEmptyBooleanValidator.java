package com.hotel.webapp.validation.validator;

import com.hotel.webapp.validation.FieldNotEmpty;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class FieldNotEmptyBooleanValidator implements ConstraintValidator<FieldNotEmpty, Boolean> {
  private String fieldName;

  @Override
  public void initialize(FieldNotEmpty constraintAnnotation) {
    this.fieldName = constraintAnnotation.field();
  }

  @Override
  public boolean isValid(Boolean value, ConstraintValidatorContext context) {
    if (value == null) {
      context.disableDefaultConstraintViolation();
      context.buildConstraintViolationWithTemplate(fieldName + "_NOT_EMPTY")
             .addConstraintViolation();
      return false;
    }
    return true;
  }
}
