package com.hotel.webapp.dto.request;

import com.hotel.webapp.dto.request.properties.PermissionProperties;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PermissionDTO {
  List<PermissionProperties> properties;
}
