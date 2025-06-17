package com.hotel.webapp.controller;

import com.hotel.webapp.dto.request.MappingDTO;
import com.hotel.webapp.dto.response.ApiResponse;
import com.hotel.webapp.dto.response.PermissionRes;
import com.hotel.webapp.entity.Permissions;
import com.hotel.webapp.service.admin.PermissionServiceImpl;
import com.hotel.webapp.validation.Permission;
import com.hotel.webapp.validation.Resource;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/permission")
@Resource(name = "permission")
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
//        @RequestParam(required = false) String name,
        @RequestParam(required = false) Map<String, String> sort) {
    Page<PermissionRes> permissions = permissionService.getAllPermissions(page, size,  sort);
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

  @GetMapping("/resource-actions")
  @Permission(name = "view")
  public ApiResponse<List<PermissionRes.DataResponse>> findActions() {
    return ApiResponse.<List<PermissionRes.DataResponse>>builder()
                      .result(permissionService.getMapResourcesActions())
                      .build();
  }
}
