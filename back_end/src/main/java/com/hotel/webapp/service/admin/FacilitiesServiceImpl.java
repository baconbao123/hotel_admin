package com.hotel.webapp.service.admin;

import com.hotel.webapp.base.BaseServiceImpl;
import com.hotel.webapp.dto.request.FacilitiesDTO;
import com.hotel.webapp.dto.response.FacilitiesRes;
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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

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

  public FacilitiesRes.FacilityRes getByIdRes(Integer id) {
    List<Object[]> facilityObjs = repository.findFacilityResById(id);
    Object[] facilityObj = facilityObjs.get(0);

    return new FacilitiesRes.FacilityRes(
          (Integer) facilityObj[0],
          (String) facilityObj[1],
          (String) facilityObj[2],
          (Integer) facilityObj[3],
          (String) facilityObj[4],
          (LocalDateTime) facilityObj[5],
          (LocalDateTime) facilityObj[6],
          (String) facilityObj[7],
          (String) facilityObj[8]
    );
  }

  public Page<FacilitiesRes> findFacilities(Map<String, String> filters, Map<String, String> sort, int size, int page) {
    Map<String, Object> filterMap = removedFiltersKey(filters);
    Map<String, Object> sortMap = removedSortedKey(sort);

    Specification<Facilities> spec = buildSpecification(filterMap);
    Pageable defaultPage = buildPageable(sortMap, page, size);

    Page<Facilities> facilitiesPage = repository.findAll(spec, defaultPage);

    return facilitiesPage.map(facility -> {
      FacilitiesRes dto = new FacilitiesRes();
      dto.setId(facility.getId());
      dto.setName(facility.getName());
      dto.setIcon(facility.getIcon());

      if (facility.getType() != null) {
        facilityTypeRepository.findById(facility.getType()).ifPresent(facilityType -> {
          dto.setTypeName(facilityType.getName());
        });
      }

      return dto;
    });


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
