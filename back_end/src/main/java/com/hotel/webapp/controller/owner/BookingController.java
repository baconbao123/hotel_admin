package com.hotel.webapp.controller.owner;

import com.hotel.webapp.dto.request.owner.BookingDTO;
import com.hotel.webapp.dto.response.ApiResponse;
import com.hotel.webapp.dto.response.owner.BookingRes;
import com.hotel.webapp.dto.response.owner.PricesDTO;
import com.hotel.webapp.entity.Booking;
import com.hotel.webapp.service.owner.BookingService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/owner/api/booking")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class BookingController {
  BookingService bookingService;

  @PostMapping
        (consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  public ApiResponse<Booking> create(@Valid @ModelAttribute BookingDTO dto) {
    return ApiResponse.<Booking>builder()
                      .result(bookingService.create(dto))
                      .build();
  }

  @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  public ApiResponse<Booking> update(@PathVariable int id, @Valid @ModelAttribute BookingDTO dto) {
    return ApiResponse.<Booking>builder()
                      .result(bookingService.update(id, dto))
                      .build();
  }

  @DeleteMapping("/{id}")
  public ApiResponse<Void> deleteHotel(@PathVariable int id) {
    bookingService.delete(id);
    return ApiResponse.<Void>builder()
                      .message("Deleted room with id " + id + " successfully")
                      .build();
  }

  @GetMapping("/{id}")
  public ApiResponse<BookingRes> getById(@PathVariable Integer id) {
    return ApiResponse.<BookingRes>builder()
                      .result(bookingService.findBookingById(id))
                      .build();
  }

  @GetMapping("/{roomId}/booking")
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

  @GetMapping("/{roomId}/prices")
  public ApiResponse<PricesDTO> getPricesData(@PathVariable Integer roomId) {
    return ApiResponse.<PricesDTO>builder()
                      .result(bookingService.getPriceData(roomId))
                      .build();
  }

  @GetMapping("/{roomId}/booked-hours")
  public ApiResponse<List<Map<String, LocalDateTime>>> getBookedHours(
        @PathVariable Integer roomId,
        @RequestParam(required = false) LocalDate startOfDay) {
    LocalDate date = startOfDay != null ? startOfDay : LocalDate.now();
    return ApiResponse.<List<Map<String, LocalDateTime>>>builder()
                      .result(bookingService.getBookedHours(roomId, date))
                      .build();
  }
}
