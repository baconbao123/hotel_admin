package com.hotel.webapp.controller;

import com.hotel.webapp.dto.request.PermissionDTO;
import com.hotel.webapp.dto.response.ApiResponse;
import com.hotel.webapp.entity.Permissions;
import com.hotel.webapp.service.admin.PermissionServiceImpl;
import com.hotel.webapp.validation.Permission;
import com.hotel.webapp.validation.Resource;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/permission")
@Resource(name = "permission")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PermissionController {
  PermissionServiceImpl permissionService;

  @PostMapping("/create")
  @Permission(name = "create")
  public ApiResponse<List<Permissions>> create(@Valid @RequestBody PermissionDTO permissionDTO) {
    return ApiResponse.<List<Permissions>>builder()
                      .result(permissionService.createCollectionBulk(permissionDTO))
                      .build();
  }

  @PutMapping("/update/{id}")
  @Permission(name = "update")
  public ApiResponse<List<Permissions>> update(@PathVariable int id,
        @Valid @RequestBody PermissionDTO permissionUpdate) {
    return ApiResponse.<List<Permissions>>builder()
                      .result(permissionService.updateCollectionBulk(id, permissionUpdate))
                      .build();
  }
}
