package com.hotel.webapp.controller;

import com.hotel.webapp.dto.request.MapHotelTypeDTO;
import com.hotel.webapp.dto.request.NameDTO;
import com.hotel.webapp.dto.response.ApiResponse;
import com.hotel.webapp.entity.MapHotelType;
import com.hotel.webapp.entity.TypeHotel;
import com.hotel.webapp.service.admin.MapHotelTypeServiceImpl;
import com.hotel.webapp.service.admin.TypeHotelServiceImpl;
import com.hotel.webapp.validation.Permission;
import com.hotel.webapp.validation.Resource;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/hotel-type")
@Resource(name = "hotel-type")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class HotelTypeController {
  TypeHotelServiceImpl typeHotelService;
  MapHotelTypeServiceImpl mapHotelTypeService;

  @Permission(name = "view")
  @GetMapping("/find-by-id/{id}")
  public ApiResponse<TypeHotel> getTypeById(@PathVariable Integer id) {
    return ApiResponse.<TypeHotel>builder()
                      .result(typeHotelService.getById(id))
                      .build();
  }

  @GetMapping("/get-all")
  @Permission(name = "view")
  public ApiResponse<Page<TypeHotel>> getAll(
        @RequestParam(required = false) Map<String, String> filters,
        @RequestParam(required = false) String sort) {
    Map<String, Object> filterMap = filters != null ? new HashMap<>(filters) : new HashMap<>();
    if (filters != null) {
      filterMap.putAll(filters);
      filterMap.remove("sort");
    }
    return ApiResponse.<Page<TypeHotel>>builder()
                      .result(typeHotelService.getAll(filterMap, sort))
                      .build();
  }


  @PostMapping("/create")
  @Permission(name = "create")
  public ApiResponse<TypeHotel> createType(@Valid @RequestBody NameDTO dto) {
    return ApiResponse.<TypeHotel>builder()
                      .result(typeHotelService.create(dto))
                      .build();
  }

  @PutMapping("/update/{id}")
  @Permission(name = "update")
  public ApiResponse<TypeHotel> updateType(@PathVariable int id, @Valid @RequestBody NameDTO dto) {
    return ApiResponse.<TypeHotel>builder()
                      .result(typeHotelService.update(id, dto))
                      .build();
  }

  @DeleteMapping("/delete/{id}")
  @Permission(name = "delete")
  public ApiResponse<Void> deleteType(@PathVariable Integer id) {
    typeHotelService.delete(id);
    return ApiResponse.<Void>builder()
                      .message("Deleted type with id " + id + " successfully")
                      .build();
  }

  // map-type-hotel
  @PostMapping("/map-hotel-type")
  @Permission(name = "create")
  public ApiResponse<List<MapHotelType>> mapHotelType(@RequestBody MapHotelTypeDTO dto) {
    return ApiResponse.<List<MapHotelType>>builder()
                      .result(mapHotelTypeService.createCollectionBulk(dto))
                      .build();
  }

  @PutMapping("/update-map-hotel-type/{id}")
  @Permission(name = "update")
  public ApiResponse<List<MapHotelType>> updateMapHotelType(@PathVariable Integer id,
        @RequestBody MapHotelTypeDTO dto) {
    return ApiResponse.<List<MapHotelType>>builder()
                      .result(mapHotelTypeService.updateCollectionBulk(id, dto))
                      .build();
  }
}
