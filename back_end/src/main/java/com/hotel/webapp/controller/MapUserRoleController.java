package com.hotel.webapp.controller;

import com.hotel.webapp.dto.request.MapURDTO;
import com.hotel.webapp.dto.response.ApiResponse;
import com.hotel.webapp.entity.Facilities;
import com.hotel.webapp.entity.MapUserRoles;
import com.hotel.webapp.service.admin.MapUserRoleServiceImp;
import com.hotel.webapp.service.admin.interfaces.AuthService;
import com.hotel.webapp.validation.Permission;
import com.hotel.webapp.validation.Resource;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/map-user-role")
@RequiredArgsConstructor
@Resource(name = "map-user-role")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class MapUserRoleController {
  MapUserRoleServiceImp mapUserRoleService;

  @PostMapping(value = "/create")
  @Permission(name = "create")
  public ApiResponse<List<MapUserRoles>> create(@RequestBody MapURDTO mapURDTO) {
    return ApiResponse.<List<MapUserRoles>>builder()
                      .result(mapUserRoleService.createCollectionBulk(mapURDTO))
                      .build();
  }

  @PutMapping(value = "/update/{id}")
  @Permission(name = "update")
  public ApiResponse<List<MapUserRoles>> update(@PathVariable Integer id, @RequestBody MapURDTO updateReq) {
    return ApiResponse.<List<MapUserRoles>>builder()
                      .result(mapUserRoleService.updateCollectionBulk(id, updateReq))
                      .build();
  }

  @GetMapping("/get-all")
  @Permission(name = "view")
  public ApiResponse<Page<MapUserRoles>> getAll(
        @RequestParam(required = false) Map<String, String> filters,
        @RequestParam(required = false) Map<String, String> sort,
        @RequestParam int size,
        @RequestParam int page
  ) {
    return ApiResponse.<Page<MapUserRoles>>builder()
                      .result(mapUserRoleService.getAll(filters, sort, size, page))
                      .build();
  }
}
