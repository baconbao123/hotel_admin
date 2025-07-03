package com.hotel.webapp.controller;

import com.hotel.webapp.dto.request.HotelDTO;
import com.hotel.webapp.dto.response.ApiResponse;
import com.hotel.webapp.dto.response.HotelsRes;
import com.hotel.webapp.entity.*;
import com.hotel.webapp.service.admin.HotelService;
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
@RequestMapping("/api/hotel")
@Resource(name = "hotel")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class HotelController {
  HotelService hotelService;



  @Permission(name = "create")
  @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  public ApiResponse<Hotels> create(
        @Valid @ModelAttribute HotelDTO hotelDTO
  ) {
    return ApiResponse.<Hotels>builder()
                      .result(hotelService.create(hotelDTO))
                      .build();
  }

  @Permission(name = "update")
  @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  public ApiResponse<Hotels> update(@PathVariable int id, @Valid @ModelAttribute HotelDTO hotelDTO) {
    return ApiResponse.<Hotels>builder()
                      .result(hotelService.update(id, hotelDTO))
                      .build();
  }

  @DeleteMapping("/{id}")
  @Permission(name = "delete")
  public ApiResponse<Void> deleteHotel(@PathVariable int id) {
    hotelService.delete(id);
    return ApiResponse.<Void>builder()
                      .message("Deleted hotel with id " + id + " successfully")
                      .build();
  }

  @GetMapping("/{id}")
  @Permission(name = "view")
  public ApiResponse<HotelsRes.HotelRes> getById(@PathVariable Integer id) {
    return ApiResponse.<HotelsRes.HotelRes>builder()
                      .result(hotelService.findHotel(id))
                      .build();
  }

  @GetMapping
  @Permission(name = "view")
  public ApiResponse<Page<HotelsRes>> getAll(
        @RequestParam(required = false) Map<String, String> filters,
        @RequestParam(required = false) Map<String, String> sort,
        @RequestParam int size,
        @RequestParam int page
  ) {
    return ApiResponse.<Page<HotelsRes>>builder()
                      .result(hotelService.findHotels(filters, sort, size, page))
                      .build();
  }

//  @GetMapping("hotel-types")
//  @Permission(name = "view")
//  public ApiResponse<List<TypeHotel>> typeHotels() {
//    return ApiResponse.<List<TypeHotel>>builder()
//                      .result(hotelService.findTypeHotels())
//                      .build();
//  }

//  @GetMapping("hotel-document-types")
//  @Permission(name = "view")
//  public ApiResponse<List<DocumentType>> hotelDocumentTypes() {
//    return ApiResponse.<List<DocumentType>>builder()
//                      .result(hotelService.findDocumentHotels())
//                      .build();
//  }

//  @GetMapping("hotel-facilities")
//  @Permission(name = "view")
//  public ApiResponse<List<Facilities>> hotelFacilities() {
//    return ApiResponse.<List<Facilities>>builder()
//                      .result(hotelService.findFacilities())
//                      .build();
//  }
}
