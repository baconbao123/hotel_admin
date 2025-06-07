package com.hotel.webapp.controller;

import com.hotel.webapp.dto.request.NameDTO;
import com.hotel.webapp.dto.response.ApiResponse;
import com.hotel.webapp.entity.FacilityType;
import com.hotel.webapp.service.admin.FacilityTypeServiceImpl;
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
@RequestMapping("/api/hotel-facility-type")
@Resource(name = "hotel-facility-type")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class HotelFacilityTypeController {
  FacilityTypeServiceImpl facilityTypeService;

  // facility-type
  @PostMapping("/create")
  @Permission(name = "create")
  public ApiResponse<FacilityType> createFacility(@Valid @RequestBody NameDTO dto) {
    return ApiResponse.<FacilityType>builder()
                      .result(facilityTypeService.create(dto))
                      .build();
  }

  @PutMapping("/update/{id}")
  @Permission(name = "update")
  public ApiResponse<FacilityType> updateFacility(@PathVariable Integer id, @Valid @RequestBody NameDTO dto) {
    return ApiResponse.<FacilityType>builder()
                      .result(facilityTypeService.update(id, dto))
                      .build();
  }

  @GetMapping("/get-all")
  @Permission(name = "view")
  public ApiResponse<Page<FacilityType>> getAll(
        @RequestParam(required = false) Map<String, String> filters,
        @RequestParam(required = false) Map<String, String> sort,
        @RequestParam int size,
        @RequestParam int page
  ) {
    return ApiResponse.<Page<FacilityType>>builder()
                      .result(facilityTypeService.getAll(filters, sort, size, page))
                      .build();
  }

  @GetMapping("/find-by-id/{id}")
  @Permission(name = "view")
  public ApiResponse<FacilityType> getByFacilityId(@PathVariable Integer id) {
    return ApiResponse.<FacilityType>builder()
                      .result(facilityTypeService.getById(id))
                      .build();
  }

  @DeleteMapping("/delete/{id}")
  @Permission(name = "delete")
  public ApiResponse<Void> deleteByFacilityId(@PathVariable Integer id) {
    facilityTypeService.delete(id);
    return ApiResponse.<Void>builder()
                      .message("Deleted facility type with id " + id + " successfully")
                      .build();
  }
}
