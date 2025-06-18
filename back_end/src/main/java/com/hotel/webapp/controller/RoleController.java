package com.hotel.webapp.controller;

import com.hotel.webapp.dto.request.RoleDTO;
import com.hotel.webapp.dto.response.ApiResponse;
import com.hotel.webapp.dto.response.CommonRes;
import com.hotel.webapp.entity.Role;
import com.hotel.webapp.service.admin.RoleServiceImpl;
import com.hotel.webapp.validation.Permission;
import com.hotel.webapp.validation.Resource;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/role")
@RequiredArgsConstructor
@Resource(name = "role")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RoleController {
  RoleServiceImpl roleService;

  @PostMapping
  @Permission(name = "create")
  public ApiResponse<Role> create(@Valid @RequestBody RoleDTO roleDTO) {
    return ApiResponse.<Role>builder()
                      .result(roleService.create(roleDTO))
                      .build();
  }

  @PutMapping("/{id}")
  @Permission(name = "update")
  public ApiResponse<Role> update(@PathVariable int id, @Valid @RequestBody RoleDTO roleDTO) {
    return ApiResponse.<Role>builder()
                      .result(roleService.update(id, roleDTO))
                      .build();
  }

  @GetMapping
  @Permission(name = "view")
  public ApiResponse<Page<Role>> getAll(
        @RequestParam(required = false) Map<String, String> filters,
        @RequestParam(required = false) Map<String, String> sort,
        @RequestParam int size,
        @RequestParam int page
  ) {
    return ApiResponse.<Page<Role>>builder()
                      .result(roleService.getAll(filters, sort, size, page))
                      .build();
  }


  @GetMapping("/{id}")
  @Permission(name = "view")
  public ApiResponse<CommonRes<Role>> findById(@PathVariable int id) {
    return ApiResponse.<CommonRes<Role>>builder()
                      .result(roleService.getEById(id))
                      .build();
  }

  @DeleteMapping("/{id}")
  @Permission(name = "delete")
  public ApiResponse<Void> deleteById(@PathVariable int id) {
    roleService.delete(id);
    return ApiResponse.<Void>builder()
                      .message("Deleted role with id " + id + " successfully")
                      .build();
  }
}
