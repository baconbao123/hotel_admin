package com.hotel.webapp.controller;

import com.hotel.webapp.dto.request.MappingDTO;
import com.hotel.webapp.dto.response.ApiResponse;
import com.hotel.webapp.dto.response.PermissionRes;
import com.hotel.webapp.entity.Permissions;
import com.hotel.webapp.entity.Resources;
import com.hotel.webapp.service.admin.PermissionServiceImpl;
import com.hotel.webapp.validation.Permission;
import com.hotel.webapp.validation.Resource;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/permission")
@Resource(name = "Permissions")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PermissionController {
  PermissionServiceImpl permissionService;

  @PutMapping
  @Permission(name = "update")
  public ApiResponse<List<Permissions>> update(@Valid @RequestBody MappingDTO permissionUpdate) {
    return ApiResponse.<List<Permissions>>builder()
                      .result(permissionService.updatePermission(permissionUpdate))
                      .build();
  }

  @GetMapping
  @Permission(name = "view")
  public ApiResponse<Page<PermissionRes>> getAllPermissions(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(required = false) Map<String, String> sort,
        @RequestParam(required = false) Map<String, String> filters) {
    Page<PermissionRes> permissions = permissionService.getAllPermissions(page, size, sort, filters);
    return ApiResponse.<Page<PermissionRes>>builder()
                      .result(permissions)
                      .build();
  }

  @GetMapping("/{roleId}")
  @Permission(name = "view")
  public ApiResponse<PermissionRes> findById(@PathVariable("roleId") Integer roleId) {
    return ApiResponse.<PermissionRes>builder()
                      .result(permissionService.getPermissionsByRoleId(roleId))
                      .build();
  }

  @GetMapping("/resources")
    public ApiResponse<List<PermissionRes.ResourceActions>> getResourceByUser() {
      return ApiResponse.<List<PermissionRes.ResourceActions>>builder()
                        .result(permissionService.getUserResource())
                        .build();
    }

//  @GetMapping("/resources")
//  public ApiResponse<List<Resources>> getResourceByUser() {
//    return ApiResponse.<List<Resources>>builder()
//                      .result(permissionService.getUserResource())
//                      .build();
//  }
}
