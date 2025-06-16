package com.hotel.webapp.controller;

import com.hotel.webapp.dto.request.FacilitiesDTO;
import com.hotel.webapp.dto.request.MapHotelFacilityDTO;
import com.hotel.webapp.dto.response.ApiResponse;
import com.hotel.webapp.entity.Facilities;
import com.hotel.webapp.entity.Hotels;
import com.hotel.webapp.entity.MapHotelFacility;
import com.hotel.webapp.service.admin.FacilitiesServiceImpl;
import com.hotel.webapp.service.admin.MapHotelFacilityServiceImpl;
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
@Resource(name = "hotel-facilities")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class HotelFacilitiesController {
  FacilitiesServiceImpl facilitiesService;
  MapHotelFacilityServiceImpl mapHotelFacilityService;

  // facilities
  @PostMapping
  @Permission(name = "create")
  public ApiResponse<Facilities> createFacilities(@Valid @RequestBody FacilitiesDTO dto) {
    return ApiResponse.<Facilities>builder()
                      .result(facilitiesService.create(dto))
                      .build();
  }

  @PutMapping("/{id}")
  @Permission(name = "update")
  public ApiResponse<Facilities> updateFacility(@PathVariable Integer id, @Valid @RequestBody FacilitiesDTO dto) {
    return ApiResponse.<Facilities>builder()
                      .result(facilitiesService.update(id, dto))
                      .build();
  }

  @GetMapping
  @Permission(name = "view")
  public ApiResponse<Page<Facilities>> getAll(
        @RequestParam(required = false) Map<String, String> filters,
        @RequestParam(required = false) Map<String, String> sort,
        @RequestParam int size,
        @RequestParam int page
  ) {
    return ApiResponse.<Page<Facilities>>builder()
                      .result(facilitiesService.getAll(filters, sort, size, page))
                      .build();
  }

  @GetMapping("/{id}")
  @Permission(name = "view")
  public ApiResponse<Facilities> getByFacilitiesId(@PathVariable Integer id) {
    return ApiResponse.<Facilities>builder()
                      .result(facilitiesService.getById(id))
                      .build();
  }

  @DeleteMapping("/{id}")
  @Permission(name = "delete")
  public ApiResponse<Void> deleteByFacilities(@PathVariable Integer id) {
    facilitiesService.delete(id);
    return ApiResponse.<Void>builder()
                      .message("Deleted facilities with id " + id + " successfully")
                      .build();
  }

  // map-facility-hotel
  @PostMapping("/map-hotel-facility")
  @Permission(name = "create")
  public ApiResponse<List<MapHotelFacility>> mapHotelFacility(@RequestBody MapHotelFacilityDTO dto) {
    return ApiResponse.<List<MapHotelFacility>>builder()
                      .result(mapHotelFacilityService.createCollectionBulk(dto))
                      .build();
  }

  @PutMapping("/update-map-hotel-facility/{id}")
  @Permission(name = "update")
  public ApiResponse<List<MapHotelFacility>> updateMapHotelFacility(@PathVariable int id,
        @RequestBody MapHotelFacilityDTO dto) {
    return ApiResponse.<List<MapHotelFacility>>builder()
                      .result(mapHotelFacilityService.updateCollectionBulk(id, dto))
                      .build();
  }
}
