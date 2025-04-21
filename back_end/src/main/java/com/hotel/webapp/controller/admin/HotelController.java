package com.hotel.webapp.controller.admin;

import com.hotel.webapp.dto.admin.request.*;
import com.hotel.webapp.dto.admin.response.ApiResponse;
import com.hotel.webapp.entity.*;
import com.hotel.webapp.service.admin.*;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/hotel")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class HotelController {
  HotelImgServiceImpl hotelImgService;
  HotelServiceImpl hotelService;
  HotelPolicyServiceImpl hotelPolicyService;
  TypeHotelServiceImpl typeHotelService;
  MapHotelTypeServiceImpl mapHotelTypeService;
  FacilityTypeServiceImpl facilityTypeService;
  FacilitiesServiceImpl facilitiesService;
  MapHotelFacilityServiceImpl mapHotelFacilityService;
  DocumentTypeServiceImpl documentTypeService;
  DocumentsHotelServiceImpl documentsHotelService;
  ApproveHotelServiceImpl approveHotelService;

  //  hotel img
  @PostMapping(value = "/upload-avatar", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  public ApiResponse<Void> uploadHotelImg(MultipartFile file) {
    hotelImgService.uploadHotelAvatar(file);
    return ApiResponse.<Void>builder()
                      .code(200)
                      .message("Avatar uploaded successfully")
                      .build();
  }

  @PutMapping(value = "/update-avatar/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  public ApiResponse<Void> updateHotelImg(@PathVariable Integer id, MultipartFile file) {
    hotelImgService.updateHotelAvatar(id, file);
    return ApiResponse.<Void>builder()
                      .code(200)
                      .message("Avatar updated successfully")
                      .build();
  }

  @DeleteMapping(value = "/delete-avatar/{id}")
  public ApiResponse<Void> deleteHotelImg(@PathVariable Integer id) {
    hotelImgService.deleteAvatar(id);
    return ApiResponse.<Void>builder()
                      .code(200)
                      .message("Avatar deleted successfully")
                      .build();
  }

  @PostMapping(value = "/upload-images", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  public ApiResponse<Void> uploadHotelImages(@Valid HotelImgsDto dto) {
    if (dto.getHotelImgs() == null || dto.getHotelImgs().isEmpty()) {
      return ApiResponse.<Void>builder().build();
    }

    hotelImgService.uploadHotelImages(dto);
    return ApiResponse.<Void>builder()
                      .code(200)
                      .message("Images uploaded successfully")
                      .build();
  }

  // map img hotel
  @PostMapping("/map-hotel-images")
  public ApiResponse<Void> mapHotelImages(@RequestBody MapHotelImgDTO dto) {
    hotelImgService.mapHotelImages(dto);
    return ApiResponse.<Void>builder()
                      .message("Hotel images uploaded successfully")
                      .build();
  }

  @PutMapping("/update-map-hotel-images")
  public ApiResponse<Void> updateMapHotelImages(@RequestBody MapHotelImgDTO dto) {
    hotelImgService.updateMapHotelImages(dto);
    return ApiResponse.<Void>builder()
                      .message("Hotel images updated successfully")
                      .build();
  }

  //  hotel
  @PostMapping(value = "/create-hotel")
  public ApiResponse<Hotels> createHotel(@Valid @RequestBody HotelDTO hotelDTO) {
    return ApiResponse.<Hotels>builder()
                      .result(hotelService.create(hotelDTO))
                      .build();
  }

  @PutMapping("/update-hotel/{id}")
  public ApiResponse<Hotels> updateHotel(@PathVariable int id, @Valid @RequestBody HotelDTO hotelDTO) {
    return ApiResponse.<Hotels>builder()
                      .result(hotelService.update(id, hotelDTO))
                      .build();
  }

  @DeleteMapping("/delete-hotel/{id}")
  public ApiResponse<Void> deleteHotel(@PathVariable int id) {
    hotelService.delete(id);
    return ApiResponse.<Void>builder()
                      .message("Deleted hotel with id " + id + " successfully")
                      .build();
  }

  @GetMapping("/find-by-id/{id}")
  public ApiResponse<Hotels> getById(@PathVariable Integer id) {
    return ApiResponse.<Hotels>builder()
                      .result(hotelService.getById(id))
                      .build();
  }

  // policy
  @PostMapping("/create-policy")
  public ApiResponse<HotelPolicy> createPolicy(@Valid @RequestBody HotelPolicyDTO dto) {
    return ApiResponse.<HotelPolicy>builder()
                      .result(hotelPolicyService.create(dto))
                      .build();
  }

  @PutMapping("/update-policy/{id}")
  public ApiResponse<HotelPolicy> updatePolicy(@PathVariable Integer id, @Valid @RequestBody HotelPolicyDTO dto) {
    return ApiResponse.<HotelPolicy>builder()
                      .result(hotelPolicyService.update(id, dto))
                      .build();
  }

  @GetMapping("/find-policy-by-id/{id}")
  public ApiResponse<HotelPolicy> getByIdPolicy(@PathVariable Integer id) {
    return ApiResponse.<HotelPolicy>builder()
                      .result(hotelPolicyService.getById(id))
                      .build();
  }

  @DeleteMapping("/delete-policy/{id}")
  public ApiResponse<Void> deletePolicy(@PathVariable Integer id) {
    hotelPolicyService.delete(id);
    return ApiResponse.<Void>builder()
                      .message("Deleted policy with id " + id + " successfully")
                      .build();
  }

  // type
  @GetMapping("/get-type/{id}")
  public ApiResponse<TypeHotel> getTypeById(@PathVariable Integer id) {
    return ApiResponse.<TypeHotel>builder()
                      .result(typeHotelService.getById(id))
                      .build();
  }

  @GetMapping("/get-types")
  public ApiResponse<List<TypeHotel>> getTypes() {
    return ApiResponse.<List<TypeHotel>>builder()
                      .result(typeHotelService.getAll())
                      .build();
  }

  @PostMapping("/create-type")
  public ApiResponse<TypeHotel> createType(@Valid @RequestBody NameDTO dto) {
    return ApiResponse.<TypeHotel>builder()
                      .result(typeHotelService.create(dto))
                      .build();
  }

  @PutMapping("/update-type/{id}")
  public ApiResponse<TypeHotel> updateType(@PathVariable int id, @Valid @RequestBody NameDTO dto) {
    return ApiResponse.<TypeHotel>builder()
                      .result(typeHotelService.update(id, dto))
                      .build();
  }

  @DeleteMapping("/delete-type/{id}")
  public ApiResponse<Void> deleteType(@PathVariable Integer id) {
    typeHotelService.delete(id);
    return ApiResponse.<Void>builder()
                      .message("Deleted type with id " + id + " successfully")
                      .build();
  }

  // map-type-hotel
  @PostMapping("/map-hotel-type")
  public ApiResponse<List<MapHotelType>> mapHotelType(@RequestBody MapHotelTypeDTO dto) {
    return ApiResponse.<List<MapHotelType>>builder()
                      .result(mapHotelTypeService.mapHotelType(dto))
                      .build();
  }

  @PutMapping("/update-map-hotel-type")
  public ApiResponse<List<MapHotelType>> updateMapHotelType(@RequestBody MapHotelTypeDTO dto) {
    return ApiResponse.<List<MapHotelType>>builder()
                      .result(mapHotelTypeService.updateMapHotelType(dto))
                      .build();
  }

  // facility-type
  @PostMapping("/facility-type")
  public ApiResponse<FacilityType> createFacility(@Valid @RequestBody NameDTO dto) {
    return ApiResponse.<FacilityType>builder()
                      .result(facilityTypeService.create(dto))
                      .build();
  }

  @PutMapping("/update-facility-type/{id}")
  public ApiResponse<FacilityType> updateFacility(@PathVariable Integer id, @Valid @RequestBody NameDTO dto) {
    return ApiResponse.<FacilityType>builder()
                      .result(facilityTypeService.update(id, dto))
                      .build();
  }

  @GetMapping("/facility-type/{id}")
  public ApiResponse<FacilityType> getByFacilityId(@PathVariable Integer id) {
    return ApiResponse.<FacilityType>builder()
                      .result(facilityTypeService.getById(id))
                      .build();
  }

  @DeleteMapping("/delete-facility-type/{id}")
  public ApiResponse<Void> deleteByFacilityId(@PathVariable Integer id) {
    facilityTypeService.delete(id);
    return ApiResponse.<Void>builder()
                      .message("Deleted facility type with id " + id + " successfully")
                      .build();
  }

  // facilities
  @PostMapping("/facilities")
  public ApiResponse<Facilities> createFacilities(@Valid @RequestBody FacilitiesDTO dto) {
    return ApiResponse.<Facilities>builder()
                      .result(facilitiesService.create(dto))
                      .build();
  }

  @PutMapping("/update-facilities/{id}")
  public ApiResponse<Facilities> updateFacility(@PathVariable Integer id, @Valid @RequestBody FacilitiesDTO dto) {
    return ApiResponse.<Facilities>builder()
                      .result(facilitiesService.update(id, dto))
                      .build();
  }

  @GetMapping("/find-facilities/{id}")
  public ApiResponse<Facilities> getByFacilitiesId(@PathVariable Integer id) {
    return ApiResponse.<Facilities>builder()
                      .result(facilitiesService.getById(id))
                      .build();
  }

  @DeleteMapping("/delete-facilities/{id}")
  public ApiResponse<Void> deleteByFacilities(@PathVariable Integer id) {
    facilitiesService.delete(id);
    return ApiResponse.<Void>builder()
                      .message("Deleted facilities with id " + id + " successfully")
                      .build();
  }

  // map-facility-hotel
  @PostMapping("/map-hotel-facility")
  public ApiResponse<List<MapHotelFacility>> mapHotelFacility(@RequestBody MapHotelFacilityDTO dto) {
    return ApiResponse.<List<MapHotelFacility>>builder()
                      .result(mapHotelFacilityService.createCollectionBulk(dto))
                      .build();
  }

  @PutMapping("/update-map-hotel-facility/{id}")
  public ApiResponse<List<MapHotelFacility>> updateMapHotelFacility(@PathVariable int id,
        @RequestBody MapHotelFacilityDTO dto) {
    return ApiResponse.<List<MapHotelFacility>>builder()
                      .result(mapHotelFacilityService.updateCollectionBulk(id, dto))
                      .build();
  }

  // document-type
  @PostMapping("/document-type")
  public ApiResponse<DocumentType> createDocumentType(@Valid @RequestBody NameDTO dto) {
    return ApiResponse.<DocumentType>builder()
                      .result(documentTypeService.create(dto))
                      .build();
  }

  @PutMapping("/update-document-type/{id}")
  public ApiResponse<DocumentType> updateDocumentType(@PathVariable Integer id, @Valid @RequestBody NameDTO dto) {
    return ApiResponse.<DocumentType>builder()
                      .result(documentTypeService.update(id, dto))
                      .build();
  }

  @GetMapping("/find-document-type/{id}")
  public ApiResponse<DocumentType> getByDocumentTypeId(@PathVariable Integer id) {
    return ApiResponse.<DocumentType>builder()
                      .result(documentTypeService.getById(id))
                      .build();
  }

  @DeleteMapping("/delete-document-type/{id}")
  public ApiResponse<Void> deleteByDocumentType(@PathVariable Integer id) {
    documentTypeService.delete(id);
    return ApiResponse.<Void>builder()
                      .message("Deleted document-type with id " + id + " successfully")
                      .build();
  }

  // document-hotel
  @PostMapping(value = "/document-hotel", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  public ApiResponse<DocumentsHotel> createDocumentsHotel(@Valid @ModelAttribute DocumentsHotelDTO dto) {
    return ApiResponse.<DocumentsHotel>builder()
                      .result(documentsHotelService.create(dto))
                      .build();
  }

  @PutMapping(value = "/update-document-hotel/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  public ApiResponse<DocumentsHotel> updateDocumentsHotel(@PathVariable Integer id,
        @Valid @ModelAttribute DocumentsHotelDTO dto) {
    return ApiResponse.<DocumentsHotel>builder()
                      .result(documentsHotelService.update(id, dto))
                      .build();
  }

  @GetMapping("/find-document-hotel/{id}")
  public ApiResponse<DocumentsHotel> getByDocumentsHotelId(@PathVariable Integer id) {
    return ApiResponse.<DocumentsHotel>builder()
                      .result(documentsHotelService.getById(id))
                      .build();
  }

  @DeleteMapping("/delete-document-hotel/{id}")
  public ApiResponse<Void> deleteByDocumentHotel(@PathVariable Integer id) {
    documentsHotelService.delete(id);
    return ApiResponse.<Void>builder()
                      .message("Deleted document-hotel with id " + id + " successfully")
                      .build();
  }

  // approve hotel
  @PostMapping(value = "/approve-hotel")
  public ApiResponse<ApproveHotel> createApproveHotel(@Valid @RequestBody ApproveHotelDTO dto) {
    return ApiResponse.<ApproveHotel>builder()
                      .result(approveHotelService.create(dto))
                      .build();
  }

  @PutMapping(value = "/update-approve-hotel/{id}")
  public ApiResponse<ApproveHotel> updateApproveHotel(@PathVariable Integer id,
        @Valid @ModelAttribute ApproveHotelDTO dto) {
    return ApiResponse.<ApproveHotel>builder()
                      .result(approveHotelService.update(id, dto))
                      .build();
  }

  @GetMapping("/find-approve-hotel/{id}")
  public ApiResponse<ApproveHotel> getByApproveHotelId(@PathVariable Integer id) {
    return ApiResponse.<ApproveHotel>builder()
                      .result(approveHotelService.getById(id))
                      .build();
  }

  @DeleteMapping("/delete-approve-hotel/{id}")
  public ApiResponse<Void> deleteApproveById(@PathVariable Integer id) {
    approveHotelService.delete(id);
    return ApiResponse.<Void>builder()
                      .message("Deleted approve with id " + id + " successfully")
                      .build();
  }
}
