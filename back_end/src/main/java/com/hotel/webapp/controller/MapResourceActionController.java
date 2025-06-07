package com.hotel.webapp.controller;

import com.hotel.webapp.dto.request.MapRADTO;
import com.hotel.webapp.dto.response.ApiResponse;
import com.hotel.webapp.entity.Facilities;
import com.hotel.webapp.entity.MapResourcesAction;
import com.hotel.webapp.service.admin.MapResourceActionServiceImpl;
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
@RequestMapping("/api/map-resource-action")
@RequiredArgsConstructor
@Resource(name = "map-resource-action")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class MapResourceActionController {
  MapResourceActionServiceImpl mapResourceActionService;

  @PostMapping(value = "/create")
  @Permission(name = "create")
  public ApiResponse<List<MapResourcesAction>> create(@RequestBody MapRADTO mapRADTO) {
    return ApiResponse.<List<MapResourcesAction>>builder()
                      .result(mapResourceActionService.createCollectionBulk(mapRADTO))
                      .build();
  }

  @Permission(name = "update")
  @PutMapping(value = "/update/{id}")
  public ApiResponse<List<MapResourcesAction>> update(@PathVariable Integer id, @RequestBody MapRADTO updateReq) {
    return ApiResponse.<List<MapResourcesAction>>builder()
                      .result(mapResourceActionService.updateCollectionBulk(id, updateReq))
                      .build();
  }

  @GetMapping("/get-all")
  @Permission(name = "view")
  public ApiResponse<Page<MapResourcesAction>> getAll(
        @RequestParam(required = false) Map<String, String> filters,
        @RequestParam(required = false) Map<String, String> sort,
        @RequestParam int size,
        @RequestParam int page
  ) {
    return ApiResponse.<Page<MapResourcesAction>>builder()
                      .result(mapResourceActionService.getAll(filters, sort, size, page))
                      .build();
  }
}
