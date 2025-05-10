package com.hotel.webapp.service.admin;

import com.hotel.webapp.base.BaseServiceImpl;
import com.hotel.webapp.dto.admin.request.MapHotelFacilityDTO;
import com.hotel.webapp.entity.MapHotelFacility;
import com.hotel.webapp.exception.AppException;
import com.hotel.webapp.exception.ErrorCode;
import com.hotel.webapp.repository.FacilitiesRepository;
import com.hotel.webapp.repository.HotelRepository;
import com.hotel.webapp.repository.MapHotelFacilityRepository;
import com.hotel.webapp.service.admin.interfaces.AuthService;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class MapHotelFacilityServiceImpl extends BaseServiceImpl<
      MapHotelFacility, Integer, MapHotelFacilityDTO, MapHotelFacilityRepository> {
  HotelRepository hotelRepository;
  FacilitiesRepository facilitiesRepository;

  public MapHotelFacilityServiceImpl(
        MapHotelFacilityRepository repository,
        AuthService authService,
        HotelRepository hotelRepository,
        FacilitiesRepository facilitiesRepository
  ) {
    super(repository, authService);
    this.hotelRepository = hotelRepository;
    this.facilitiesRepository = facilitiesRepository;
  }

  @Override
  public List<MapHotelFacility> createCollectionBulk(MapHotelFacilityDTO mapHotelFacilityDTO) {
    validateDTOCommon(mapHotelFacilityDTO);

    List<MapHotelFacility> listDto = new ArrayList<>();
    for (Integer facilityId : mapHotelFacilityDTO.getFacilityId()) {
      var mapHotelFacility = new MapHotelFacility();
      mapHotelFacility.setFacilityId(facilityId);
      mapHotelFacility.setHotelId(mapHotelFacilityDTO.getHotelId());
      mapHotelFacility.setCreatedAt(LocalDateTime.now());
      mapHotelFacility.setCreatedBy(authService.getAuthLogin());
      mapHotelFacility = repository.save(mapHotelFacility);
      listDto.add(mapHotelFacility);
    }

    return listDto;
  }

  @Override
  public List<MapHotelFacility> updateCollectionBulk(Integer integer, MapHotelFacilityDTO mapHotelFacilityDTO) {
    validateDTOCommon(mapHotelFacilityDTO);

    var oldMapping = repository.findByHotelIdAndDeletedAtIsNull(mapHotelFacilityDTO.getHotelId());
    for (MapHotelFacility mapHotelFacility : oldMapping) {
      mapHotelFacility.setDeletedAt(LocalDateTime.now());
      mapHotelFacility.setUpdatedAt(LocalDateTime.now());
      mapHotelFacility.setUpdatedBy(authService.getAuthLogin());
      repository.save(mapHotelFacility);
    }

    List<MapHotelFacility> listDto = new ArrayList<>();
    for (Integer facilityId : mapHotelFacilityDTO.getFacilityId()) {
      var mapHotelFacility = new MapHotelFacility();
      mapHotelFacility.setFacilityId(facilityId);
      mapHotelFacility.setHotelId(mapHotelFacilityDTO.getHotelId());
      mapHotelFacility.setCreatedAt(LocalDateTime.now());
      mapHotelFacility.setCreatedBy(authService.getAuthLogin());
      mapHotelFacility = repository.save(mapHotelFacility);
      listDto.add(mapHotelFacility);
    }

    return listDto;
  }

  @Override
  protected void validateDTOCommon(MapHotelFacilityDTO mapHotelFacilityDTO) {
    if (!hotelRepository.existsByIdAndDeletedAtIsNull(mapHotelFacilityDTO.getHotelId()))
      throw new AppException(ErrorCode.NOT_FOUND, "Hotel");

    for (Integer facilityId : mapHotelFacilityDTO.getFacilityId()) {
      if (!facilitiesRepository.existsByIdAndDeletedAtIsNull(facilityId))
        throw new AppException(ErrorCode.NOT_FOUND, "Facility");
    }
  }

  @Override
  protected RuntimeException createNotFoundException(Integer integer) {
    return new AppException(ErrorCode.NOT_FOUND, "Map Hotel Facility");
  }
}
