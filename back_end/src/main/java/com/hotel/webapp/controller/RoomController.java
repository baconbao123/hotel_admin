package com.hotel.webapp.controller;

import com.hotel.webapp.dto.request.RoomDTO;
import com.hotel.webapp.dto.response.ApiResponse;
import com.hotel.webapp.entity.Rooms;
import com.hotel.webapp.service.admin.RoomService;
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
@RequestMapping("/api/rooms")
@Resource(name = "room")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RoomController {
  RoomService roomService;

  @Permission(name = "create")
  @PostMapping(consumes = {"multipart/form-data"})
  public ApiResponse<Rooms> create(
        @Valid @ModelAttribute RoomDTO roomDTO
  ) {
    return ApiResponse.<Rooms>builder()
                      .result(roomService.create(roomDTO))
                      .build();
  }

  @Permission(name = "update")
  @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  public ApiResponse<Rooms> update(@PathVariable int id, @Valid @ModelAttribute RoomDTO roomDTO) {
    return ApiResponse.<Rooms>builder()
                      .result(roomService.update(id, roomDTO))
                      .build();
  }

  @DeleteMapping("/{id}")
  @Permission(name = "delete")
  public ApiResponse<Void> deleteHotel(@PathVariable int id) {
    roomService.delete(id);
    return ApiResponse.<Void>builder()
                      .message("Deleted room with id " + id + " successfully")
                      .build();
  }

  @GetMapping("/{id}")
  @Permission(name = "view")
  public ApiResponse<Rooms> getById(@PathVariable Integer id) {
    return ApiResponse.<Rooms>builder()
                      .result(roomService.findById(id))
                      .build();
  }

  @GetMapping
  @Permission(name = "view")
  public ApiResponse<Page<Rooms>> getAll(
        @RequestParam(required = false) Map<String, String> filters,
        @RequestParam(required = false) Map<String, String> sort,
        @RequestParam int size,
        @RequestParam int page
  ) {
    return ApiResponse.<Page<Rooms>>builder()
                      .result(roomService.getAll(filters, sort, size, page))
                      .build();
  }

}
