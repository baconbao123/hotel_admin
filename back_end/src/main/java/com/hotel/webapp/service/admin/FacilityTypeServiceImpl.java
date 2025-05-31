package com.hotel.webapp.service.admin;

import com.hotel.webapp.base.BaseServiceImpl;
import com.hotel.webapp.dto.request.NameDTO;
import com.hotel.webapp.entity.Facilities;
import com.hotel.webapp.entity.FacilityType;
import com.hotel.webapp.entity.MapHotelFacility;
import com.hotel.webapp.exception.AppException;
import com.hotel.webapp.exception.ErrorCode;
import com.hotel.webapp.repository.FacilitiesRepository;
import com.hotel.webapp.repository.FacilityTypeRepository;
import com.hotel.webapp.repository.MapHotelFacilityRepository;
import com.hotel.webapp.service.admin.interfaces.AuthService;
import com.hotel.webapp.util.ValidateDataInput;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class FacilityTypeServiceImpl extends BaseServiceImpl<FacilityType, Integer, NameDTO, FacilityTypeRepository> {
  ValidateDataInput validateDataInput;
  FacilitiesRepository facilitiesRepository;
  MapHotelFacilityRepository mapHotelFacilityRepository;

  public FacilityTypeServiceImpl(
        FacilityTypeRepository repository,
        AuthService authService,
        ValidateDataInput validateDataInput,
        FacilitiesRepository facilitiesRepository,
        MapHotelFacilityRepository mapHotelFacilityRepository
  ) {
    super(repository, authService);
    this.validateDataInput = validateDataInput;
    this.facilitiesRepository = facilitiesRepository;
    this.mapHotelFacilityRepository = mapHotelFacilityRepository;
  }

  @Override
  public FacilityType create(NameDTO create) {
    validateCreate(create);

    var facilityType = FacilityType.builder()
                                   .name(create.getName())
                                   .colName(validateDataInput.generateColName(create.getName()))
                                   .createdAt(LocalDateTime.now())
                                   .createdBy(getAuthId())
                                   .build();
    return repository.save(facilityType);
  }

  @Override
  public FacilityType update(Integer id, NameDTO update) {
    var facilityType = getById(id);
    validateUpdate(id, update);

    facilityType.setName(update.getName());
    facilityType.setColName(validateDataInput.generateColName(update.getName()));
    facilityType.setUpdatedAt(LocalDateTime.now());
    facilityType.setUpdatedBy(getAuthId());

    return repository.save(facilityType);
  }

  @Override
  protected void validateCreate(NameDTO create) {
    if (repository.existsByNameAndDeletedAtIsNull(create.getName()))
      throw new AppException(ErrorCode.FIELD_EXISTED, "Facility Type");
    validateDataInput.lowercaseStr(create.getName());
  }

  @Override
  protected void validateUpdate(Integer id, NameDTO update) {
    if (repository.existsByNameAndIdNotAndDeletedAtIsNull(update.getName(), id))
      throw new AppException(ErrorCode.FIELD_EXISTED, "Facility Type");
    validateDataInput.lowercaseStr(update.getName());
  }


  @Override
  protected void beforeDelete(Integer id) {
    deleteFacilities(id);
  }

  private void deleteFacilities(Integer facilityTypeId) {
    String colName = repository.findColNameById(facilityTypeId);
    var allByFacilityTypeId = facilitiesRepository.findByColNameAndDeletedAtIsNull(colName);
    deleteMapHotelFacilities(allByFacilityTypeId);

    for (Facilities facility : allByFacilityTypeId) {
      facility.setDeletedAt(LocalDateTime.now());
      facility.setUpdatedAt(LocalDateTime.now());
      facility.setUpdatedBy(authService.getAuthLogin());
      facilitiesRepository.save(facility);
    }
  }

  private void deleteMapHotelFacilities(List<Facilities> facilities) {
    for (Facilities facility : facilities) {
      var mapold = mapHotelFacilityRepository.findByFacilityIdAndDeletedAtIsNull(facility.getId());
      for (MapHotelFacility mapHotelFacility : mapold) {
        mapHotelFacility.setDeletedAt(LocalDateTime.now());
        mapHotelFacility.setUpdatedAt(LocalDateTime.now());
        mapHotelFacility.setUpdatedBy(authService.getAuthLogin());
        mapHotelFacilityRepository.save(mapHotelFacility);
      }
    }
  }

  @Override
  protected RuntimeException createNotFoundException(Integer integer) {
    return new AppException(ErrorCode.NOT_FOUND, "Facility type");
  }
}
