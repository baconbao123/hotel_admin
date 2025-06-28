package com.hotel.webapp.dto.response;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PermissionRes {
  //  Integer permissionId;
  String createdBy;
  LocalDateTime createdAt;
  String updateBy;
  LocalDateTime updatedAt;

  List<RoleRes> roleRes;

  @Getter
  @Setter
  @AllArgsConstructor
  @FieldDefaults(level = AccessLevel.PRIVATE)
  public static class RoleRes {
    Integer roleId;
    String roleName;
    List<DataResponse> permissions;
  }

  @Getter
  @Setter
  @AllArgsConstructor
  @FieldDefaults(level = AccessLevel.PRIVATE)
  public static class DataResponse {
    Integer id; // map resource action id
    Integer resourceId;
    String resourceName;
    Integer actionId;
    String actionName;
  }

  @Getter
  @Setter
  @AllArgsConstructor
  @FieldDefaults(level = AccessLevel.PRIVATE)
  public static class ResourceActions {
    String resourceName;
    List<String> actionNames;
  }
}
