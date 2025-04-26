package com.hotel.webapp.controller.admin;

import com.hotel.webapp.dto.admin.request.NameDTO;
import com.hotel.webapp.dto.admin.response.ApiResponse;
import com.hotel.webapp.entity.Actions;
import com.hotel.webapp.service.admin.ActionServiceImpl;
import com.hotel.webapp.validation.Permission;
import com.hotel.webapp.validation.Resource;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// rest full api
@RestController
@RequestMapping("/api/action")
@RequiredArgsConstructor
@Resource(name = "action")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ActionController {
  ActionServiceImpl actionServiceImpl;

  @PostMapping("/create")
  @Permission(name = "create")
  public ApiResponse<Actions> create(@Valid @RequestBody NameDTO nameDTO) {
    return ApiResponse.<Actions>builder()
                      .result(actionServiceImpl.create(nameDTO))
                      .build();
  }

  @Permission(name = "update")
  @PutMapping("/update/{id}")
  public ApiResponse<Actions> update(@PathVariable int id, @Valid @RequestBody NameDTO updateReq) {
    return ApiResponse.<Actions>builder()
                      .result(actionServiceImpl.update(id, updateReq))
                      .build();
  }

  @GetMapping("/get-all")
  @Permission(name = "view")
  public ApiResponse<List<Actions>> getAll() {
    return ApiResponse.<List<Actions>>builder()
                      .result(actionServiceImpl.getAll())
                      .build();
  }

  @GetMapping("/find-by-id/{id}")
  @Permission(name = "view")
  public ApiResponse<Actions> findById(@PathVariable int id) {
    return ApiResponse.<Actions>builder()
                      .result(actionServiceImpl.getById(id))
                      .build();
  }

  @DeleteMapping("/delete/{id}")
  @Permission(name = "delete")
  public ApiResponse<Void> deleteById(@PathVariable int id) {
    actionServiceImpl.delete(id);
    return ApiResponse.<Void>builder()
                      .message("Deleted action with id " + id + " successfully")
                      .build();
  }
}
