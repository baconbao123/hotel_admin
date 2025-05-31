package com.hotel.webapp.controller;

import com.hotel.webapp.dto.request.HotelPolicyDTO;
import com.hotel.webapp.dto.response.ApiResponse;
import com.hotel.webapp.entity.HotelPolicy;
import com.hotel.webapp.service.admin.HotelPolicyServiceImpl;
import com.hotel.webapp.validation.Permission;
import com.hotel.webapp.validation.Resource;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/hotel-policy")
@Resource(name = "hotel-policy")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class HotelPolicyController {
  HotelPolicyServiceImpl hotelPolicyService;

  // policy
  @PostMapping("/create")
  @Permission(name = "create")
  public ApiResponse<HotelPolicy> createPolicy(@Valid @RequestBody HotelPolicyDTO dto) {
    return ApiResponse.<HotelPolicy>builder()
                      .result(hotelPolicyService.create(dto))
                      .build();
  }

  @PutMapping("/update/{id}")
  @Permission(name = "update")
  public ApiResponse<HotelPolicy> updatePolicy(@PathVariable Integer id, @Valid @RequestBody HotelPolicyDTO dto) {
    return ApiResponse.<HotelPolicy>builder()
                      .result(hotelPolicyService.update(id, dto))
                      .build();
  }

  @GetMapping("/find-by-id/{id}")
  @Permission(name = "view")
  public ApiResponse<HotelPolicy> getByIdPolicy(@PathVariable Integer id) {
    return ApiResponse.<HotelPolicy>builder()
                      .result(hotelPolicyService.getById(id))
                      .build();
  }

  @DeleteMapping("/delete/{id}")
  @Permission(name = "delete")
  public ApiResponse<Void> deletePolicy(@PathVariable Integer id) {
    hotelPolicyService.delete(id);
    return ApiResponse.<Void>builder()
                      .message("Deleted policy with id " + id + " successfully")
                      .build();
  }
}
