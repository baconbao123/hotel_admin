package com.hotel.webapp.service.admin;

import com.hotel.webapp.dto.admin.request.MapHotelTypeDTO;
import com.hotel.webapp.entity.MapHotelType;
import com.hotel.webapp.exception.AppException;
import com.hotel.webapp.exception.ErrorCode;
import com.hotel.webapp.repository.HotelRepository;
import com.hotel.webapp.repository.MapHotelTypeRepository;
import com.hotel.webapp.repository.TypeHotelRepository;
import com.hotel.webapp.service.admin.interfaces.AuthService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class MapHotelTypeServiceImpl {
  MapHotelTypeRepository mapHotelTypeRepository;
  HotelRepository hotelRepository;
  TypeHotelRepository typeHotelRepository;
  AuthService authService;

  public List<MapHotelType> mapHotelType(MapHotelTypeDTO dto) {
    if (!hotelRepository.existsByIdAndDeletedAtIsNull(dto.getHotelId()))
      throw new AppException(ErrorCode.HOTEL_NOTFOUND);

    for (Integer typeId : dto.getTypeId()) {
      if (!typeHotelRepository.existsByIdAndDeletedAtIsNull(typeId))
        throw new AppException(ErrorCode.TYPE_NOTFOUND);
    }

    List<MapHotelType> mapList = new ArrayList<>();
    for (Integer typeId : dto.getTypeId()) {
      var map = new MapHotelType();
      map.setHotelId(dto.getHotelId());
      map.setTypeId(typeId);
      map.setCreatedAt(Timestamp.valueOf(LocalDateTime.now()));
      map.setCreatedBy(authService.getAuthLogin());
      map = mapHotelTypeRepository.save(map);
      mapList.add(map);
    }

    return mapList;
  }

  public List<MapHotelType> updateMapHotelType(MapHotelTypeDTO dto) {
    if (!hotelRepository.existsByIdAndDeletedAtIsNull(dto.getHotelId()))
      throw new AppException(ErrorCode.HOTEL_NOTFOUND);

    for (Integer typeId : dto.getTypeId()) {
      if (!typeHotelRepository.existsByIdAndDeletedAtIsNull(typeId))
        throw new AppException(ErrorCode.TYPE_NOTFOUND);
    }

    if (!mapHotelTypeRepository.existsByHotelIdAndDeletedAtIsNull(dto.getHotelId())) {
      throw new AppException(ErrorCode.MAPPING_HOTEL_NOTFOUND);
    }

    var oldMap = mapHotelTypeRepository.findByHotelIdAndDeletedAtIsNull(dto.getHotelId());
    for (MapHotelType mapHotelType : oldMap) {
      mapHotelType.setDeletedAt(LocalDateTime.now());
      mapHotelType.setUpdatedAt(new Timestamp(System.currentTimeMillis()));
      mapHotelType.setUpdatedBy(authService.getAuthLogin());
      mapHotelTypeRepository.save(mapHotelType);
    }

    List<MapHotelType> newMapList = new ArrayList<>();
    for (Integer typeId : dto.getTypeId()) {
      var map = new MapHotelType();
      map.setHotelId(dto.getHotelId());
      map.setTypeId(typeId);
      map.setCreatedAt(Timestamp.valueOf(LocalDateTime.now()));
      map.setCreatedBy(authService.getAuthLogin());
      map = mapHotelTypeRepository.save(map);
      newMapList.add(map);
    }

    return newMapList;
  }
}
