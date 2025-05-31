package com.hotel.webapp.controller;

import com.hotel.webapp.dto.request.ApproveHotelDTO;
import com.hotel.webapp.dto.response.ApiResponse;
import com.hotel.webapp.entity.ApproveHotel;
import com.hotel.webapp.service.admin.ApproveHotelServiceImpl;
import com.hotel.webapp.validation.Permission;
import com.hotel.webapp.validation.Resource;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/hotel-approve")
@Resource(name = "hotel-approve")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class HotelApproveController {
  ApproveHotelServiceImpl approveHotelService;

  // approve hotel
  @PostMapping(value = "/create")
  @Permission(name = "create")
  public ApiResponse<ApproveHotel> createApproveHotel(@Valid @RequestBody ApproveHotelDTO dto) {
    return ApiResponse.<ApproveHotel>builder()
                      .result(approveHotelService.create(dto))
                      .build();
  }

  @PutMapping(value = "/update/{id}")
  @Permission(name = "update")
  public ApiResponse<ApproveHotel> updateApproveHotel(@PathVariable Integer id,
        @Valid @ModelAttribute ApproveHotelDTO dto) {
    return ApiResponse.<ApproveHotel>builder()
                      .result(approveHotelService.update(id, dto))
                      .build();
  }

  @GetMapping("/find-by-id/{id}")
  @Permission(name = "view")
  public ApiResponse<ApproveHotel> getByApproveHotelId(@PathVariable Integer id) {
    return ApiResponse.<ApproveHotel>builder()
                      .result(approveHotelService.getById(id))
                      .build();
  }

  @DeleteMapping("/delete/{id}")
  @Permission(name = "delete")
  public ApiResponse<Void> deleteApproveById(@PathVariable Integer id) {
    approveHotelService.delete(id);
    return ApiResponse.<Void>builder()
                      .message("Deleted approve with id " + id + " successfully")
                      .build();
  }
}
