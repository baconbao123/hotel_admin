package com.hotel.webapp.controller;

import com.hotel.webapp.dto.request.NameDTO;
import com.hotel.webapp.dto.response.ApiResponse;
import com.hotel.webapp.entity.DocumentType;
import com.hotel.webapp.service.admin.DocumentTypeServiceImpl;
import com.hotel.webapp.validation.Permission;
import com.hotel.webapp.validation.Resource;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/document-type")
@Resource(name = "document-type")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class DocumentTypeController {
  DocumentTypeServiceImpl documentTypeService;

  @PostMapping("/document-type")
  @Permission(name = "create")
  public ApiResponse<DocumentType> createDocumentType(@Valid @RequestBody NameDTO dto) {
    return ApiResponse.<DocumentType>builder()
                      .result(documentTypeService.create(dto))
                      .build();
  }

  @PutMapping("/update/{id}")
  @Permission(name = "update")
  public ApiResponse<DocumentType> updateDocumentType(@PathVariable Integer id, @Valid @RequestBody NameDTO dto) {
    return ApiResponse.<DocumentType>builder()
                      .result(documentTypeService.update(id, dto))
                      .build();
  }

  @GetMapping("/get-all")
  @Permission(name = "view")
  public ApiResponse<Page<DocumentType>> findAll(
        @RequestParam(required = false) Map<String, String> filters,
        @RequestParam(required = false) Map<String, String> sort,
        @RequestParam int size,
        @RequestParam int page
  ) {
    return ApiResponse.<Page<DocumentType>>builder()
                      .result(documentTypeService.getAll(filters, sort, size, page))
                      .build();
  }

  @GetMapping("/find-by-id/{id}")
  @Permission(name = "view")
  public ApiResponse<DocumentType> getByDocumentTypeId(@PathVariable Integer id) {
    return ApiResponse.<DocumentType>builder()
                      .result(documentTypeService.getById(id))
                      .build();
  }

  @DeleteMapping("/delete/{id}")
  @Permission(name = "delete")
  public ApiResponse<Void> deleteByDocumentType(@PathVariable Integer id) {
    documentTypeService.delete(id);
    return ApiResponse.<Void>builder()
                      .message("Deleted document-type with id " + id + " successfully")
                      .build();
  }
}
