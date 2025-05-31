package com.hotel.webapp.controller;

import com.hotel.webapp.dto.request.AddressDTO;
import com.hotel.webapp.dto.response.ApiResponse;
import com.hotel.webapp.entity.Address;
import com.hotel.webapp.service.admin.AddressServiceImpl;
import com.hotel.webapp.validation.Permission;
import com.hotel.webapp.validation.Resource;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/address")
@RequiredArgsConstructor
@Resource(name = "address")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AddressController {
  AddressServiceImpl addressService;

  @PostMapping("/create")
  @Permission(name = "create")
  public ApiResponse<Address> create(@Valid @RequestBody AddressDTO addressDTO) {
    return ApiResponse.<Address>builder()
                      .result(addressService.create(addressDTO))
                      .build();
  }

  @PutMapping("/update/{id}")
  @Permission(name = "update")
  public ApiResponse<Address> update(@PathVariable int id, @Valid @RequestBody AddressDTO updateReq) {
    return ApiResponse.<Address>builder()
                      .result(addressService.update(id, updateReq))
                      .build();
  }

  @GetMapping("/get-all")
  @Permission(name = "view")
  public ApiResponse<Page<Address>> getAll(
        @RequestParam(required = false) Map<String, String> filters,
        @RequestParam(required = false) String sort) {
    Map<String, Object> filterMap = filters != null ? new HashMap<>(filters) : new HashMap<>();
    if (filters != null) {
      filterMap.putAll(filters);
      filterMap.remove("sort");
    }
    return ApiResponse.<Page<Address>>builder()
                      .result(addressService.getAll(filterMap, sort))
                      .build();
  }

  @GetMapping("/find-by-id/{id}")
  @Permission(name = "view")
  public ApiResponse<Address> findById(@PathVariable int id) {
    return ApiResponse.<Address>builder()
                      .result(addressService.getById(id))
                      .build();
  }

  @DeleteMapping("/delete/{id}")
  @Permission(name = "delete")
  public ApiResponse<Void> deleteById(@PathVariable int id) {
    addressService.delete(id);
    return ApiResponse.<Void>builder()
                      .message("Deleted action with id " + id + " successfully")
                      .build();
  }
}
