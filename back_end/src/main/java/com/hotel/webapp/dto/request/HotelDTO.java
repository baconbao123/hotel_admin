package com.hotel.webapp.dto.request;

import com.hotel.webapp.validation.FieldNotEmpty;
import com.hotel.webapp.validation.MultipartFileCheckEmptyAndSize;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class HotelDTO {
  @FieldNotEmpty(field = "Name")
  String name;
  String description;
  @FieldNotEmpty(field = "Status")
  Boolean status;

  Integer ownerId;

  //  approve
  String noteHotel;

  // address
  @FieldNotEmpty(field = "Province")
  String provinceCode;
  @FieldNotEmpty(field = "District")
  String districtCode;
  @FieldNotEmpty(field = "Ward")
  String wardCode;
  @FieldNotEmpty(field = "Street")
  Integer streetId;
  @FieldNotEmpty(field = "Street number")
  String streetNumber;
  String note;

  // type
  @FieldNotEmpty(field = "Hotel Type")
  List<Integer> typeIds;

  // document
  @Valid
  @FieldNotEmpty(field = "Document")
  List<DocumentReq> documents;

  // images ---
  @MultipartFileCheckEmptyAndSize(field = "Images", value = 200, force = false)
  List<ImagesReq> images;

  // avatar ---
  @Valid
  @FieldNotEmpty(field = "Avatar")
  AvatarReq avatar;

  // policy ---
  @Valid
  @FieldNotEmpty(field = "Policy")
  PolicyReq policy;

  // facilities
  @FieldNotEmpty(field = "Facilities")
  List<Integer> facilities;

  @Getter
  @Setter
  @FieldDefaults(level = AccessLevel.PRIVATE)
  public static class AvatarReq {
    String keepAvatar = "false";
    @MultipartFileCheckEmptyAndSize(field = "avatar", value = 100, force = false)
    MultipartFile avatarUrl;
    String existingAvatarUrl;
  }

  @Getter
  @Setter
  @FieldDefaults(level = AccessLevel.PRIVATE)
  public static class ImagesReq {
    Integer imageId = null;
    String existingImageUrl = null;
    MultipartFile imageFile;
  }

  @Getter
  @Setter
  @FieldDefaults(level = AccessLevel.PRIVATE)
  public static class DocumentReq {
    Integer documentId = null;
    @FieldNotEmpty(field = "Document Name")
    String documentName;
    @FieldNotEmpty(field = "Document Type")
    Integer typeId;
    @MultipartFileCheckEmptyAndSize(field = "Document file", value = 100,
          force = false)
    MultipartFile documentUrl;
    String existingDocumentUrl;
    Boolean keepDocument = true;
  }

  @Getter
  @Setter
  @FieldDefaults(level = AccessLevel.PRIVATE)
  public static class PolicyReq {
    Integer policyId;
    @FieldNotEmpty(field = "Policy Name")
    String policyName;
    @FieldNotEmpty(field = "Policy Description")
    String policyDescription;
  }
}
