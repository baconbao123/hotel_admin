package com.hotel.webapp.service.admin;

import com.hotel.webapp.base.BaseMapper;
import com.hotel.webapp.base.BaseServiceImpl;
import com.hotel.webapp.dto.admin.request.FacilitiesDTO;
import com.hotel.webapp.entity.Facilities;
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
public class FacilitiesServiceImpl extends BaseServiceImpl<Facilities, Integer, FacilitiesDTO, FacilitiesRepository> {
  ValidateDataInput validateDataInput;
  FacilityTypeRepository facilityTypeRepository;
  MapHotelFacilityRepository mapHotelFacilityRepository;

  public FacilitiesServiceImpl(
        FacilitiesRepository repository,
        BaseMapper<Facilities, FacilitiesDTO> mapper,
        AuthService authService,
        FacilityTypeRepository facilityTypeRepository,
        ValidateDataInput validateDataInput,
        MapHotelFacilityRepository mapHotelFacilityRepository
  ) {
    super(repository, mapper, authService);
    this.validateDataInput = validateDataInput;
    this.facilityTypeRepository = facilityTypeRepository;
    this.mapHotelFacilityRepository = mapHotelFacilityRepository;
  }

  @Override
  protected void validateDTOCommon(FacilitiesDTO facilitiesDTO) {
    if (!facilityTypeRepository.existsByIdAndDeletedAtIsNull(facilitiesDTO.getTypeId()))
      throw new AppException(ErrorCode.FACILITY_NOTFOUND);
    validateDataInput.capitalizeFirstLetter(facilitiesDTO.getName());
  }

  @Override
  protected void validateCreate(FacilitiesDTO create) {
  }

  @Override
  protected void validateUpdate(Integer id, FacilitiesDTO update) {
  }

  @Override
  protected void validateDelete(Integer id) {
    var facilities = repository.findByIdAndDeletedAtIsNull(id);
    deleteMapHotelFacilities(facilities);
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
