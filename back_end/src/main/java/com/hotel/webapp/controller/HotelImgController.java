//package com.hotel.webapp.controller;
//
//import com.hotel.webapp.dto.request.HotelImgsDto;
//import com.hotel.webapp.dto.request.MapHotelImgDTO;
//import com.hotel.webapp.dto.response.ApiResponse;
//import com.hotel.webapp.entity.HotelImages;
//import com.hotel.webapp.service.admin.HotelImgServiceImpl;
//import com.hotel.webapp.validation.Permission;
//import com.hotel.webapp.validation.Resource;
//import jakarta.validation.Valid;
//import lombok.AccessLevel;
//import lombok.RequiredArgsConstructor;
//import lombok.experimental.FieldDefaults;
//import org.springframework.http.MediaType;
//import org.springframework.web.bind.annotation.*;
//import org.springframework.web.multipart.MultipartFile;
//
//@RestController
//@RequestMapping("/api/hotel-image")
//@Resource(name = "hotel-image")
//@RequiredArgsConstructor
//@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
//public class HotelImgController {
//  HotelImgServiceImpl hotelImgService;
//
//  //  hotel img
//  @Permission(name = "create")
//  @PostMapping(value = "/upload-avatar", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
//  public ApiResponse<Void> uploadHotelImg(MultipartFile file) {
//    hotelImgService.uploadHotelAvatar(file);
//    return ApiResponse.<Void>builder()
//                      .code(200)
//                      .message("Avatar uploaded successfully")
//                      .build();
//  }
//
//  @Permission(name = "view")
//  @GetMapping(value = "/find-by-id/{id}")
//  public ApiResponse<HotelImages> getById(@PathVariable Integer id) {
//    return ApiResponse.<HotelImages>builder()
//                      .code(200)
//                      .result(hotelImgService.getById(id))
//                      .build();
//  }
//
//  @Permission(name = "update")
//  @PutMapping(value = "/update-avatar/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
//  public ApiResponse<Void> updateHotelImg(@PathVariable Integer id, MultipartFile file) {
//    hotelImgService.updateHotelAvatar(id, file);
//    return ApiResponse.<Void>builder()
//                      .code(200)
//                      .message("Avatar updated successfully")
//                      .build();
//  }
//
//  @Permission(name = "delete")
//  @DeleteMapping(value = "/delete-avatar/{id}")
//  public ApiResponse<Void> deleteHotelImg(@PathVariable Integer id) {
//    hotelImgService.deleteAvatar(id);
//    return ApiResponse.<Void>builder()
//                      .code(200)
//                      .message("Avatar deleted successfully")
//                      .build();
//  }
//
//  @Permission(name = "create")
//  @PostMapping(value = "/upload-images", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
//  public ApiResponse<Void> uploadHotelImages(@Valid HotelImgsDto dto) {
//    if (dto.getHotelImgs() == null || dto.getHotelImgs().isEmpty()) {
//      return ApiResponse.<Void>builder().build();
//    }
//
//    hotelImgService.uploadHotelImages(dto);
//    return ApiResponse.<Void>builder()
//                      .code(200)
//                      .message("Images uploaded successfully")
//                      .build();
//  }
//
//  // map img hotel
//  @Permission(name = "create")
//  @PostMapping("/map-hotel-images")
//  public ApiResponse<Void> mapHotelImages(@RequestBody MapHotelImgDTO dto) {
//    hotelImgService.mapHotelImages(dto);
//    return ApiResponse.<Void>builder()
//                      .message("Hotel images uploaded successfully")
//                      .build();
//  }
//
//  @Permission(name = "update")
//  @PutMapping("/update-map-hotel-images")
//  public ApiResponse<Void> updateMapHotelImages(@RequestBody MapHotelImgDTO dto) {
//    hotelImgService.updateMapHotelImages(dto);
//    return ApiResponse.<Void>builder()
//                      .message("Hotel images updated successfully")
//                      .build();
//  }
//}
