package com.hotel.webapp.controller.admin;

import com.hotel.webapp.dto.admin.request.AddressDTO;
import com.hotel.webapp.dto.admin.response.ApiResponse;
import com.hotel.webapp.entity.Address;
import com.hotel.webapp.service.admin.AddressServiceImpl;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/address")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AddressController {
  AddressServiceImpl addressService;

  @PostMapping("/create")
  public ApiResponse<Address> create(@Valid @RequestBody AddressDTO addressDTO) {
    return ApiResponse.<Address>builder()
                      .result(addressService.create(addressDTO))
                      .build();
  }

  @PutMapping("/update/{id}")
  public ApiResponse<Address> update(@PathVariable int id, @Valid @RequestBody AddressDTO updateReq) {
    return ApiResponse.<Address>builder()
                      .result(addressService.update(id, updateReq))
                      .build();
  }

  @GetMapping("/get-all")
  public ApiResponse<List<Address>> getAll() {
    return ApiResponse.<List<Address>>builder()
                      .result(addressService.getAll())
                      .build();
  }

  @GetMapping("/find-by-id/{id}")
  public ApiResponse<Address> findById(@PathVariable int id) {
    return ApiResponse.<Address>builder()
                      .result(addressService.getById(id))
                      .build();
  }

  @DeleteMapping("/delete/{id}")
  public ApiResponse<Void> deleteById(@PathVariable int id) {
    addressService.delete(id);
    return ApiResponse.<Void>builder()
                      .message("Deleted action with id " + id + " successfully")
                      .build();
  }
}
