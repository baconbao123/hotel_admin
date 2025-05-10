package com.hotel.webapp.util;

import org.springframework.stereotype.Component;

@Component
public class ValidateDataInput {
  public String capitalizeFirstLetter(String str) {
    return str != null && !str.isEmpty() ? (str.substring(0, 1).toUpperCase() + str.substring(1).toLowerCase()) : null;
  }

  public String lowercaseStr(String str) {
    return str != null && !str.isEmpty() ? str.toLowerCase() : null;
  }

  public String generateColName(String str) {
    return str.toLowerCase()
              .replaceAll("[^a-zA-Z\\s]", "")
              .trim()
              .replaceAll("\\s+", "_");

  }
}
