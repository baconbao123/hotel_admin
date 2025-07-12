package com.hotel.webapp.controller;

import com.hotel.webapp.dto.request.StreetsDTO;
import com.hotel.webapp.dto.response.ApiResponse;
import com.hotel.webapp.dto.response.CommonRes;
import com.hotel.webapp.entity.Streets;
import com.hotel.webapp.service.admin.LocalService;
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
@RequestMapping("/api/street")
@RequiredArgsConstructor
@Resource(name = "Street")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class StreetController {
  LocalService localService;

  @PostMapping
  @Permission(name = "create")
  public ApiResponse<Streets> createStreet(@RequestBody @Valid StreetsDTO dto) {
    return ApiResponse.<Streets>builder()
                      .result(localService.create(dto))
                      .build();
  }

  @PutMapping("/{id}")
  @Permission(name = "update")
  public ApiResponse<Streets> updateStreet(@PathVariable Integer id, @RequestBody @Valid StreetsDTO dto) {
    return ApiResponse.<Streets>builder()
                      .result(localService.update(id, dto))
                      .build();
  }

  @GetMapping("/{id}")
  @Permission(name = "view")
  public ApiResponse<CommonRes<Streets>> findStreetById(@PathVariable Integer id) {
    return ApiResponse.<CommonRes<Streets>>builder()
                      .result(localService.getEById(id))
                      .build();
  }

  @DeleteMapping("/{id}")
  @Permission(name = "view")
  public ApiResponse<Object> updateStreet(@PathVariable Integer id) {
    localService.delete(id);
    return ApiResponse.builder()
                      .message("Delete street successful")
                      .build();
  }

  @GetMapping
  @Permission(name = "view")
  public ApiResponse<Page<Streets>> getAll(
        @RequestParam(required = false) Map<String, String> filters,
        @RequestParam(required = false) Map<String, String> sort,
        @RequestParam int size,
        @RequestParam int page
  ) {
    return ApiResponse.<Page<Streets>>builder()
                      .result(localService.getAll(filters, sort, size, page))
                      .build();
  }

}
