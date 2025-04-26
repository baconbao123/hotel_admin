package com.hotel.webapp.service.admin;

import com.hotel.webapp.base.BaseMapper;
import com.hotel.webapp.base.BaseServiceImpl;
import com.hotel.webapp.dto.admin.request.NameDTO;
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
        BaseMapper<FacilityType, NameDTO> mapper,
        AuthService authService,
        ValidateDataInput validateDataInput,
        FacilitiesRepository facilitiesRepository,
        MapHotelFacilityRepository mapHotelFacilityRepository
  ) {
    super(repository, mapper, authService);
    this.validateDataInput = validateDataInput;
    this.facilitiesRepository = facilitiesRepository;
    this.mapHotelFacilityRepository = mapHotelFacilityRepository;
  }

  @Override
  protected void validateCreate(NameDTO create) {
    if (repository.existsByNameAndDeletedAtIsNull(create.getName()))
      throw new AppException(ErrorCode.FACILITY_EXIST);
    validateDataInput.lowercaseFirstLetter(create.getName());
  }

  @Override
  protected void validateUpdate(Integer id, NameDTO update) {
    if (repository.existsByNameAndIdNotAndDeletedAtIsNull(update.getName(), id))
      throw new AppException(ErrorCode.FACILITY_EXIST);
    validateDataInput.lowercaseFirstLetter(update.getName());
  }

  @Override
  protected void validateDelete(Integer id) {
    deleteFacilities(id);
  }

  private void deleteFacilities(Integer facilityTypeId) {
    var allByFacilityTypeId = facilitiesRepository.findByTypeIdAndDeletedAtIsNull(facilityTypeId);
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
    return new AppException(ErrorCode.FACILITY_NOTFOUND);
  }
}
