package com.hotel.webapp.dto.response;

import com.hotel.webapp.entity.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AttributeDataResponse {
  List<Role> roles;
  List<LocalResponse> provinces;
//  List<LocalResponse> districts;
//  List<LocalResponse> wards;
//  List<LocalResponse.StreetResponse> streets;
  List<FacilityType> facilityTypes;
  List<PermissionRes.DataResponse> resourceActions;
  List<DocumentType> documentTypes;
  List<TypeHotel> hotelTypes;
  List<Facilities> hotelFacilities;
}
