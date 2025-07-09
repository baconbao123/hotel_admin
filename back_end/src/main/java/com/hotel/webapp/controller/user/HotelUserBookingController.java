package com.hotel.webapp.controller.user;

import com.hotel.webapp.dto.request.owner.BookingDTO;
import com.hotel.webapp.dto.response.ApiResponse;
import com.hotel.webapp.dto.user_response.BookingUserRes;
import com.hotel.webapp.entity.Booking;
import com.hotel.webapp.service.owner.BookingService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/booking/user")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class HotelUserBookingController {
  BookingService bookingService;

  @GetMapping("/{roomId}")
  public BookingUserRes getRoomBookingForDate(
        @PathVariable Integer roomId,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
  ) {
    return bookingService.bookingUserRes(roomId, date);
  }

  @PostMapping
        (consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  public ApiResponse<Booking> create(@Valid @ModelAttribute BookingDTO.UserBookingDTO dto) {
    return ApiResponse.<Booking>builder()
                      .result(bookingService.userCreate(dto))
                      .build();
  }

  @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  public ApiResponse<Booking> update(@PathVariable int id, @Valid @ModelAttribute BookingDTO.UserBookingDTO dto) {
    return ApiResponse.<Booking>builder()
                      .result(bookingService.userUpdate(id, dto))
                      .build();
  }

  @GetMapping("/{userId}/booking")
  public List<Booking> getAllBookingByUserId(@PathVariable Integer userId) {
    return bookingService.findAllBookingByUserId(userId);
  }
}
