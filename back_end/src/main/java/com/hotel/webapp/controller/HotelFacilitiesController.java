package com.hotel.webapp.controller;

import com.hotel.webapp.dto.request.FacilitiesDTO;
import com.hotel.webapp.dto.response.ApiResponse;
import com.hotel.webapp.dto.response.FacilitiesRes;
import com.hotel.webapp.entity.Facilities;
import com.hotel.webapp.entity.FacilityType;
import com.hotel.webapp.service.admin.FacilitiesServiceImpl;
import com.hotel.webapp.validation.Permission;
import com.hotel.webapp.validation.Resource;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/hotel-facilities")
@Resource(name = "Facilities")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class HotelFacilitiesController {
  FacilitiesServiceImpl facilitiesService;

  // facilities
  @PostMapping
  @Permission(name = "create")
  public ApiResponse<Facilities> createFacilities(@Valid @RequestBody FacilitiesDTO dto) {
    return ApiResponse.<Facilities>builder()
                      .result(facilitiesService.create(dto))
                      .build();
  }

  @PutMapping(value = "/{id}")
  @Permission(name = "update")
  public ApiResponse<Facilities> updateFacility(@PathVariable Integer id, @Valid @RequestBody FacilitiesDTO dto) {
    return ApiResponse.<Facilities>builder()
                      .result(facilitiesService.update(id, dto))
                      .build();
  }

  @GetMapping
  @Permission(name = "view")
  public ApiResponse<Page<FacilitiesRes>> getAll(
        @RequestParam(required = false) Map<String, String> filters,
        @RequestParam(required = false) Map<String, String> sort,
        @RequestParam int size,
        @RequestParam int page
  ) {
    return ApiResponse.<Page<FacilitiesRes>>builder()
                      .result(facilitiesService.findFacilities(filters, sort, size, page))
                      .build();
  }

  @GetMapping("/{id}")
  @Permission(name = "view")
  public ApiResponse<FacilitiesRes.FacilityRes> getByFacilitiesId(@PathVariable Integer id) {
    return ApiResponse.<FacilitiesRes.FacilityRes>builder()
                      .result(facilitiesService.getByIdRes(id))
                      .build();
  }

//  @GetMapping("/facilities-type")
//  @Permission(name = "view")
//  public ApiResponse<List<FacilityType>> getByFacilitiesId() {
//    return ApiResponse.<List<FacilityType>>builder()
//                      .result(facilitiesService.findAllFacilityType())
//                      .build();
//  }

  @DeleteMapping("/{id}")
  @Permission(name = "delete")
  public ApiResponse<Void> deleteByFacilities(@PathVariable Integer id) {
    facilitiesService.delete(id);
    return ApiResponse.<Void>builder()
                      .message("Deleted facilities with id " + id + " successfully")
                      .build();
  }
}
