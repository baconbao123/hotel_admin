package com.hotel.webapp.controller.admin;

import com.hotel.webapp.dto.admin.request.HotelDTO;
import com.hotel.webapp.dto.admin.response.ApiResponse;
import com.hotel.webapp.entity.Hotels;
import com.hotel.webapp.service.admin.HotelServiceImpl;
import com.hotel.webapp.validation.Permission;
import com.hotel.webapp.validation.Resource;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/hotel")
@Resource(name = "hotel")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class HotelController {
  HotelServiceImpl hotelService;

  @PostMapping(value = "/create")
  @Permission(name = "create")
  public ApiResponse<Hotels> createHotel(@Valid @RequestBody HotelDTO hotelDTO) {
    return ApiResponse.<Hotels>builder()
                      .result(hotelService.create(hotelDTO))
                      .build();
  }

  @PutMapping("/update/{id}")
  @Permission(name = "update")
  public ApiResponse<Hotels> updateHotel(@PathVariable int id, @Valid @RequestBody HotelDTO hotelDTO) {
    return ApiResponse.<Hotels>builder()
                      .result(hotelService.update(id, hotelDTO))
                      .build();
  }

  @DeleteMapping("/delete/{id}")
  @Permission(name = "delete")
  public ApiResponse<Void> deleteHotel(@PathVariable int id) {
    hotelService.delete(id);
    return ApiResponse.<Void>builder()
                      .message("Deleted hotel with id " + id + " successfully")
                      .build();
  }

  @GetMapping("/find-by-id/{id}")
  @Permission(name = "view")
  public ApiResponse<Hotels> getById(@PathVariable Integer id) {
    return ApiResponse.<Hotels>builder()
                      .result(hotelService.getById(id))
                      .build();
  }
}
