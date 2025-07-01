package com.hotel.webapp.controller;

import com.hotel.webapp.dto.response.ApiResponse;
import com.hotel.webapp.dto.response.AttributeDataResponse;
import com.hotel.webapp.service.admin.*;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CommonController {
  RoleService roleService;
  LocalService localService;
  FacilitiesService facilitiesService;
  PermissionService permissionService;
  HotelService hotelService;
  UserService userService;
  PaymentService paymentService;
  RoomService roomService;

  @GetMapping("/common-data")
  public ApiResponse<AttributeDataResponse> getCommonData(
        @RequestParam List<String> types,
        @RequestParam(required = false) String keyword,
        @RequestParam(required = false) Integer pageOwner
  ) {
    AttributeDataResponse.AttributeDataResponseBuilder builder = AttributeDataResponse.builder();

    for (String type : types) {
      switch (type.toLowerCase()) {
        case "roles":
          builder.roles(roleService.getRoles());
          break;
        case "provinces":
          builder.provinces(localService.getProvinces());
          break;
        case "facilitiestype":
          builder.facilityTypes(facilitiesService.findAllFacilityType());
          break;
        case "permissions":
          builder.resourceActions(permissionService.getMapResourcesActions());
          break;
        case "hoteldocuments":
          builder.documentTypes(hotelService.findDocumentHotels());
          break;
        case "hoteltypes":
          builder.hotelTypes(hotelService.findTypeHotels());
          break;
        case "hotelfacilities":
          builder.hotelFacilities(hotelService.findFacilities());
          break;
        case "paymentmethods":
          builder.paymentMethods(paymentService.findAllPayment());
          break;
        case "roomtypes":
          builder.roomTypes(roomService.findRoomTypes());
          break;
        case "owners":
          builder.owners(userService.findOwner(keyword, pageOwner != null ? pageOwner : 0));
          break;
        case "usertypes":
          builder.userTypes(userService.findUserTypes());
          break;
        default:
          break;
      }
    }

    return ApiResponse.<AttributeDataResponse>builder()
                      .result(builder.build())
                      .build();
  }


}
