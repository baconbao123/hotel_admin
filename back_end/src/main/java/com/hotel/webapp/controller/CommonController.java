package com.hotel.webapp.controller;

import com.hotel.webapp.dto.response.ApiResponse;
import com.hotel.webapp.dto.response.AttributeDataResponse;
import com.hotel.webapp.entity.Resources;
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
  RoleServiceImpl roleService;
  LocalServiceImpl localService;
  FacilitiesServiceImpl facilitiesService;
  PermissionServiceImpl permissionService;
  HotelServiceImpl hotelService;

  @GetMapping("/common-data")
  public ApiResponse<AttributeDataResponse> getCommonData(
        @RequestParam List<String> types
//        @RequestParam(required = false) String provinceCode,
//        @RequestParam(required = false) String districtCode,
//        @RequestParam(required = false) String wardCode
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
//        case "districts":
//          if (provinceCode != null && !provinceCode.isBlank()) {
//            builder.districts(localService.findDistrictsByProvinceCode(provinceCode));
//          }
//          break;
//        case "wards":
//          if (districtCode != null && !districtCode.isBlank()) {
//            builder.wards(localService.findWardsByDistrict(districtCode));
//          }
//          break;
//        case "streets":
//          if (wardCode != null && !wardCode.isBlank()) {
//            builder.streets(localService.findStreetByWard(wardCode));
//          }
//          break;
        case "facility-types":
          builder.facilityTypes(facilitiesService.findAllFacilityType());
          break;
        case "resource-actions":
          builder.resourceActions(permissionService.getMapResourcesActions());
          break;
        case "hotel-documents":
          builder.documentTypes(hotelService.findDocumentHotels());
          break;
        case "hotel-types":
          builder.hotelTypes(hotelService.findTypeHotels());
          break;
        case "hotel-facilities":
          builder.hotelFacilities(hotelService.findFacilities());
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
