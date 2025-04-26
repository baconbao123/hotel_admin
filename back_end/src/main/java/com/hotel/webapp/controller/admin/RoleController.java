package com.hotel.webapp.controller.admin;

import com.hotel.webapp.dto.admin.request.RoleDTO;
import com.hotel.webapp.dto.admin.response.ApiResponse;
import com.hotel.webapp.entity.Role;
import com.hotel.webapp.service.admin.RoleServiceImpl;
import com.hotel.webapp.validation.Permission;
import com.hotel.webapp.validation.Resource;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/role")
@RequiredArgsConstructor
@Resource(name = "role")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RoleController {
  RoleServiceImpl roleService;

  @PostMapping("/create")
  @Permission(name = "create")
  public ApiResponse<Role> create(@Valid @RequestBody RoleDTO roleDTO) {
    return ApiResponse.<Role>builder()
                      .result(roleService.create(roleDTO))
                      .build();
  }

  @PutMapping("/update/{id}")
  @Permission(name = "update")
  public ApiResponse<Role> update(@PathVariable int id, @Valid @RequestBody RoleDTO roleDTO) {
    return ApiResponse.<Role>builder()
                      .result(roleService.update(id, roleDTO))
                      .build();
  }

  @GetMapping("/get-all")
  @Permission(name = "view")
  public ApiResponse<List<Role>> getAll() {
    return ApiResponse.<List<Role>>builder()
                      .result(roleService.getAll())
                      .build();
  }

  @GetMapping("/find-by-id/{id}")
  @Permission(name = "view")
  public ApiResponse<Role> findById(@PathVariable int id) {
    return ApiResponse.<Role>builder()
                      .result(roleService.getById(id))
                      .build();
  }

  @DeleteMapping("/delete/{id}")
  @Permission(name = "delete")
  public ApiResponse<Void> deleteById(@PathVariable int id) {
    roleService.delete(id);
    return ApiResponse.<Void>builder()
                      .message("Deleted role with id " + id + " successfully")
                      .build();
  }
}
