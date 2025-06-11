package com.hotel.webapp.validation.validator;

import com.hotel.webapp.validation.MaxSizeListImg;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public class MaxSizeListImgValidator implements ConstraintValidator<MaxSizeListImg, List<MultipartFile>> {
  private int maxSize;

  @Override
  public void initialize(MaxSizeListImg constraintAnnotation) {
    this.maxSize = constraintAnnotation.value();
  }

  @Override
  public boolean isValid(List<MultipartFile> files, ConstraintValidatorContext context) {
    if (files.size() > maxSize) {
      context.disableDefaultConstraintViolation();
      context.buildConstraintViolationWithTemplate(
              "Maximum of %d".formatted(maxSize)
      ).addConstraintViolation();
      return false;
    }
    return true;
  }
}
