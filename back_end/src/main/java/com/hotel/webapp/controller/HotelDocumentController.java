package com.hotel.webapp.controller;

import com.hotel.webapp.dto.request.DocumentsHotelDTO;
import com.hotel.webapp.dto.response.ApiResponse;
import com.hotel.webapp.entity.DocumentsHotel;
import com.hotel.webapp.entity.Hotels;
import com.hotel.webapp.service.admin.DocumentsHotelServiceImpl;
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
@RequestMapping("/api/hotel-document")
@Resource(name = "hotel-document")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class HotelDocumentController {
  DocumentsHotelServiceImpl documentsHotelService;

  @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  @Permission(name = "create")
  public ApiResponse<DocumentsHotel> createDocumentsHotel(@Valid @ModelAttribute DocumentsHotelDTO dto) {
    return ApiResponse.<DocumentsHotel>builder()
                      .result(documentsHotelService.create(dto))
                      .build();
  }

  @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  @Permission(name = "update")
  public ApiResponse<DocumentsHotel> updateDocumentsHotel(@PathVariable Integer id,
        @Valid @ModelAttribute DocumentsHotelDTO dto) {
    return ApiResponse.<DocumentsHotel>builder()
                      .result(documentsHotelService.update(id, dto))
                      .build();
  }

  @GetMapping
  @Permission(name = "view")
  public ApiResponse<Page<DocumentsHotel>> getAll(
        @RequestParam(required = false) Map<String, String> filters,
        @RequestParam(required = false) Map<String, String> sort,
        @RequestParam int size,
        @RequestParam int page
  ) {
    return ApiResponse.<Page<DocumentsHotel>>builder()
                      .result(documentsHotelService.getAll(filters, sort, size, page))
                      .build();
  }

  @GetMapping("/{id}")
  @Permission(name = "view")
  public ApiResponse<DocumentsHotel> getByDocumentsHotelId(@PathVariable Integer id) {
    return ApiResponse.<DocumentsHotel>builder()
                      .result(documentsHotelService.getById(id))
                      .build();
  }

  @DeleteMapping("/{id}")
  @Permission(name = "delete")
  public ApiResponse<Void> deleteByDocumentHotel(@PathVariable Integer id) {
    documentsHotelService.delete(id);
    return ApiResponse.<Void>builder()
                      .message("Deleted document-hotel with id " + id + " successfully")
                      .build();
  }

}
