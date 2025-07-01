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
  List<FacilityType> facilityTypes;
  List<PermissionRes.DataResponse> resourceActions;
  List<DocumentType> documentTypes;
  List<TypeHotel> hotelTypes;
  List<Facilities> hotelFacilities;
  List<PaymentMethod> paymentMethods;
  List<RoomType> roomTypes;
  List<UserRes.OwnerRes> owners;
  List<UserType> userTypes;

}
