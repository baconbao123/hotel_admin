package com.hotel.webapp.controller.admin;

import com.hotel.webapp.dto.admin.request.StreetDTO;
import com.hotel.webapp.dto.admin.response.ApiResponse;
import com.hotel.webapp.entity.Streets;
import com.hotel.webapp.service.admin.StreetServiceImpl;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// rest full api
@RestController
@RequestMapping("/api/street")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class StreetController {
  StreetServiceImpl streetService;

  @PostMapping("/create")
  public ApiResponse<Streets> create(@Valid @RequestBody StreetDTO streetDTO) {
    return ApiResponse.<Streets>builder()
                      .result(streetService.create(streetDTO))
                      .build();
  }

  @PutMapping("/update/{id}")
  public ApiResponse<Streets> update(@PathVariable int id, @Valid @RequestBody StreetDTO updateReq) {
    return ApiResponse.<Streets>builder()
                      .result(streetService.update(id, updateReq))
                      .build();
  }

  @GetMapping("/get-all")
  public ApiResponse<List<Streets>> getAll() {
    return ApiResponse.<List<Streets>>builder()
                      .result(streetService.getAll())
                      .build();
  }

  @GetMapping("/find-by-id/{id}")
  public ApiResponse<Streets> findById(@PathVariable int id) {
    return ApiResponse.<Streets>builder()
                      .result(streetService.getById(id))
                      .build();
  }

  @DeleteMapping("/delete/{id}")
  public ApiResponse<Void> deleteById(@PathVariable int id) {
    streetService.delete(id);
    return ApiResponse.<Void>builder()
                      .message("Deleted action with id " + id + " successfully")
                      .build();
  }
}
