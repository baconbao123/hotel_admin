package com.hotel.webapp.validation;

import com.hotel.webapp.validation.validator.FieldNotEmptyBooleanValidator;
import com.hotel.webapp.validation.validator.FieldNotEmptyIntegerValidator;
import com.hotel.webapp.validation.validator.FieldNotEmptyValidator;
import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = {
      FieldNotEmptyValidator.class,
      FieldNotEmptyIntegerValidator.class,
      FieldNotEmptyBooleanValidator.class
})
public @interface FieldNotEmpty {
  String message() default "{field} cannot be empty";

  Class<?>[] groups() default {};

  Class<? extends Payload>[] payload() default {};

  String field();
}
