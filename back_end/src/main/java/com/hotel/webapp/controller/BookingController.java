package com.hotel.webapp.controller;

import com.hotel.webapp.dto.request.BookingDTO;
import com.hotel.webapp.dto.response.ApiResponse;
import com.hotel.webapp.dto.response.BookingRes;
import com.hotel.webapp.entity.Booking;
import com.hotel.webapp.service.admin.BookingService;
import com.hotel.webapp.validation.Permission;
import com.hotel.webapp.validation.Resource;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/booking")
@Resource(name = "Booking")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class BookingController {
  BookingService bookingService;

  @Permission(name = "create")
  @PostMapping
  public ApiResponse<Booking> create(
        @Valid @RequestBody BookingDTO roomDTO
  ) {
    return ApiResponse.<Booking>builder()
                      .result(bookingService.create(roomDTO))
                      .build();
  }

  @Permission(name = "update")
  @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  public ApiResponse<Booking> update(@PathVariable int id, @Valid @RequestBody BookingDTO roomDTO) {
    return ApiResponse.<Booking>builder()
                      .result(bookingService.update(id, roomDTO))
                      .build();
  }

  @DeleteMapping("/{id}")
  @Permission(name = "delete")
  public ApiResponse<Void> deleteHotel(@PathVariable int id) {
    bookingService.delete(id);
    return ApiResponse.<Void>builder()
                      .message("Deleted room with id " + id + " successfully")
                      .build();
  }

  @GetMapping("/{id}")
  @Permission(name = "view")
  public ApiResponse<Booking> getById(@PathVariable Integer id) {
    return ApiResponse.<Booking>builder()
                      .result(bookingService.findById(id))
                      .build();
  }

  @GetMapping("/{roomId}/booking")
  @Permission(name = "view")
  public ApiResponse<Page<BookingRes>> getAll(
        @PathVariable Integer roomId,
        @RequestParam(required = false) Map<String, String> filters,
        @RequestParam(required = false) Map<String, String> sort,
        @RequestParam int size,
        @RequestParam int page
  ) {
    return ApiResponse.<Page<BookingRes>>builder()
                      .result(bookingService.findBookingsByRoomId(roomId, filters, sort, size, page))
                      .build();
  }

}
