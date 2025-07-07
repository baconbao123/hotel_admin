package com.hotel.webapp.controller.owner;

import com.hotel.webapp.dto.request.owner.HotelOwnerDTO;
import com.hotel.webapp.dto.response.ApiResponse;
import com.hotel.webapp.dto.response.HotelsRes;
import com.hotel.webapp.entity.Hotels;
import com.hotel.webapp.service.owner.HotelOwnerService;
import com.hotel.webapp.validation.Permission;
import com.nimbusds.jose.JOSEException;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;
import java.util.Map;

@RestController
@RequestMapping("/owner/api/hotel")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class HotelOwnerController {
  HotelOwnerService hotelService;


  @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  public ApiResponse<Hotels> update(@PathVariable int id,
        @Valid @ModelAttribute HotelOwnerDTO.HotelUpdateDTO hotelDTO) {
    return ApiResponse.<Hotels>builder()
                      .result(hotelService.updateHotel(id, hotelDTO))
                      .build();
  }

  @DeleteMapping("/{id}")
  public ApiResponse<Void> deleteHotel(@PathVariable int id) {
    hotelService.delete(id);
    return ApiResponse.<Void>builder()
                      .message("Deleted hotel with id " + id + " successfully")
                      .build();
  }

  @GetMapping("/{id}")
  public ApiResponse<HotelsRes.HotelRes> getById(@PathVariable Integer id) {
    return ApiResponse.<HotelsRes.HotelRes>builder()
                      .result(hotelService.findHotel(id))
                      .build();
  }

  @GetMapping
  public ApiResponse<Page<HotelsRes>> getAll(
        @RequestParam(required = false) Map<String, String> filters,
        @RequestParam(required = false) Map<String, String> sort,
        @RequestParam int size,
        @RequestParam int page
  ) throws ParseException, JOSEException {
    return ApiResponse.<Page<HotelsRes>>builder()
                      .result(hotelService.findHotels(filters, sort, size, page))
                      .build();
  }
}
