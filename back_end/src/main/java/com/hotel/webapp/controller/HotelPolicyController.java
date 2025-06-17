package com.hotel.webapp.controller;

import com.hotel.webapp.dto.request.HotelPolicyDTO;
import com.hotel.webapp.dto.response.ApiResponse;
import com.hotel.webapp.entity.Facilities;
import com.hotel.webapp.entity.HotelPolicy;
import com.hotel.webapp.service.admin.HotelPolicyServiceImpl;
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
@RequestMapping("/api/hotel-policy")
@Resource(name = "hotel-policy")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class HotelPolicyController {
  HotelPolicyServiceImpl hotelPolicyService;

  // policy
  @PostMapping
  @Permission(name = "create")
  public ApiResponse<HotelPolicy> createPolicy(@Valid @RequestBody HotelPolicyDTO dto) {
    return ApiResponse.<HotelPolicy>builder()
                      .result(hotelPolicyService.create(dto))
                      .build();
  }

  @PutMapping("/{id}")
  @Permission(name = "update")
  public ApiResponse<HotelPolicy> updatePolicy(@PathVariable Integer id, @Valid @RequestBody HotelPolicyDTO dto) {
    return ApiResponse.<HotelPolicy>builder()
                      .result(hotelPolicyService.update(id, dto))
                      .build();
  }

  @GetMapping
  @Permission(name = "view")
  public ApiResponse<Page<HotelPolicy>> getAll(
        @RequestParam(required = false) Map<String, String> filters,
        @RequestParam(required = false) Map<String, String> sort,
        @RequestParam int size,
        @RequestParam int page
  ) {
    return ApiResponse.<Page<HotelPolicy>>builder()
                      .result(hotelPolicyService.getAll(filters, sort, size, page))
                      .build();
  }

  @GetMapping("/{id}")
  @Permission(name = "view")
  public ApiResponse<HotelPolicy> getByIdPolicy(@PathVariable Integer id) {
    return ApiResponse.<HotelPolicy>builder()
                      .result(hotelPolicyService.getById(id))
                      .build();
  }

  @DeleteMapping("/{id}")
  @Permission(name = "delete")
  public ApiResponse<Void> deletePolicy(@PathVariable Integer id) {
    hotelPolicyService.delete(id);
    return ApiResponse.<Void>builder()
                      .message("Deleted policy with id " + id + " successfully")
                      .build();
  }
}
