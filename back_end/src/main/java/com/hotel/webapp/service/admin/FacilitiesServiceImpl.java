package com.hotel.webapp.service.admin;

import com.hotel.webapp.base.BaseServiceImpl;
import com.hotel.webapp.dto.request.FacilitiesDTO;
import com.hotel.webapp.entity.Facilities;
import com.hotel.webapp.entity.FacilityType;
import com.hotel.webapp.entity.MapHotelFacility;
import com.hotel.webapp.exception.AppException;
import com.hotel.webapp.exception.ErrorCode;
import com.hotel.webapp.mapper.FacilitiesMapper;
import com.hotel.webapp.repository.FacilitiesRepository;
import com.hotel.webapp.repository.FacilityTypeRepository;
import com.hotel.webapp.repository.MapHotelFacilityRepository;
import com.hotel.webapp.service.admin.interfaces.AuthService;
import com.hotel.webapp.util.ValidateDataInput;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class FacilitiesServiceImpl extends BaseServiceImpl<Facilities, Integer, FacilitiesDTO, FacilitiesRepository> {
  ValidateDataInput validateDataInput;
  FacilityTypeRepository facilityTypeRepository;
  MapHotelFacilityRepository mapHotelFacilityRepository;

  public FacilitiesServiceImpl(
        FacilitiesRepository repository,
        FacilitiesMapper mapper,
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
    validateDataInput.capitalizeFirstLetter(facilitiesDTO.getName());
  }

  @Override
  protected void beforeCommon(Facilities facilities, FacilitiesDTO create) {
    if (create.getIcon() != null) {
      facilities.setIcon(validateDataInput.cutIcon(create.getIcon()));
    }
  }

  @Override
  protected void beforeDelete(Integer id) {
    var facilities = repository.findByIdAndDeletedAtIsNull(id);
    deleteMapHotelFacilities(facilities);
  }

  public List<FacilityType> findAllFacilityType() {
    return facilityTypeRepository.findAllFacilityType();
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
    return new AppException(ErrorCode.NOT_FOUND, "Facilities");
  }
}
