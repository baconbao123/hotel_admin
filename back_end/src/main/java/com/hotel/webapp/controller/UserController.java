package com.hotel.webapp.controller;

import com.hotel.webapp.dto.request.UserDTO;
import com.hotel.webapp.dto.response.ApiResponse;
import com.hotel.webapp.dto.response.UserRes;
import com.hotel.webapp.entity.Role;
import com.hotel.webapp.entity.User;
import com.hotel.webapp.service.admin.RoleServiceImpl;
import com.hotel.webapp.service.admin.UserServiceImpl;
import com.hotel.webapp.validation.Permission;
import com.hotel.webapp.validation.Resource;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
@Resource(name = "user")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserController {
  UserServiceImpl userService;
  RoleServiceImpl roleService;

  @Permission(name = "create")
  @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  public ApiResponse<User> create(@Valid @ModelAttribute UserDTO userDTO) throws IOException {
    log.error("Received UserDTO: " + userDTO);
    return ApiResponse.<User>builder()
                      .result(userService.create(userDTO))
                      .build();
  }

  @Permission(name = "update")
  @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  public ApiResponse<User> update(@PathVariable int id, @Valid @ModelAttribute UserDTO userDTO) throws IOException {
    return ApiResponse.<User>builder()
                      .result(userService.update(id, userDTO))
                      .build();
  }

  @GetMapping
  @Permission(name = "view")
  public ApiResponse<Page<User>> getAll(
        @RequestParam(required = false) Map<String, String> filters,
        @RequestParam(required = false) Map<String, String> sort,
        @RequestParam int size,
        @RequestParam int page
  ) {
    return ApiResponse.<Page<User>>builder()
                      .result(userService.getAll(filters, sort, size, page))
                      .build();
  }

  @DeleteMapping("/{id}")
  @Permission(name = "delete")
  public ApiResponse<Void> deleteById(@PathVariable int id) {
    userService.delete(id);
    return ApiResponse.<Void>builder()
                      .message("Deleted user with id " + id + " successfully")
                      .build();
  }

  @GetMapping("/{id}")
  @Permission(name = "view")
  public ApiResponse<UserRes> findById(@PathVariable Integer id) {
    return ApiResponse.<UserRes>builder()
                      .result(userService.findUserById(id))
                      .build();
  }

  @GetMapping("/get-roles")
  @Permission(name = "view")
  public ApiResponse<List<Role>> getAll() {
    return ApiResponse.<List<Role>>builder()
                      .result(roleService.getRoles())
                      .build();
  }

}
