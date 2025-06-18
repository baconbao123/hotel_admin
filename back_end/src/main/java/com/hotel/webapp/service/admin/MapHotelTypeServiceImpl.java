//package com.hotel.webapp.service.admin;
//
//import com.hotel.webapp.base.BaseServiceImpl;
//import com.hotel.webapp.dto.request.MapHotelTypeDTO;
//import com.hotel.webapp.entity.MapHotelType;
//import com.hotel.webapp.exception.AppException;
//import com.hotel.webapp.exception.ErrorCode;
//import com.hotel.webapp.repository.HotelRepository;
//import com.hotel.webapp.repository.MapHotelTypeRepository;
//import com.hotel.webapp.repository.TypeHotelRepository;
//import com.hotel.webapp.service.admin.interfaces.AuthService;
//import lombok.AccessLevel;
//import lombok.experimental.FieldDefaults;
//import org.springframework.stereotype.Service;
//
//import java.time.LocalDateTime;
//import java.util.ArrayList;
//import java.util.List;
//
//@Service
//@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
//public class MapHotelTypeServiceImpl extends BaseServiceImpl<MapHotelType, Integer, MapHotelTypeDTO, MapHotelTypeRepository> {
//  HotelRepository hotelRepository;
//  TypeHotelRepository typeHotelRepository;
//
//  public MapHotelTypeServiceImpl(
//        MapHotelTypeRepository repository,
//        AuthService authService,
//        HotelRepository hotelRepository,
//        TypeHotelRepository typeHotelRepository
//  ) {
//    super(repository, authService);
//    this.hotelRepository = hotelRepository;
//    this.typeHotelRepository = typeHotelRepository;
//  }
//
//  @Override
//  public List<MapHotelType> createCollectionBulk(MapHotelTypeDTO mapHotelTypeDTO) {
//    validateDTOCommon(mapHotelTypeDTO);
//
//    List<MapHotelType> mapList = new ArrayList<>();
//    for (String typeId : mapHotelTypeDTO.getColNames()) {
//      var map = new MapHotelType();
//      map.setHotelId(mapHotelTypeDTO.getHotelId());
//      map.setColName(typeId);
//      map.setCreatedAt(LocalDateTime.now());
//      map.setCreatedBy(authService.getAuthLogin());
//      map = repository.save(map);
//      mapList.add(map);
//    }
//
//    return mapList;
//  }
//
//  @Override
//  public List<MapHotelType> updateCollectionBulk(Integer id, MapHotelTypeDTO mapHotelTypeDTO) {
//    validateDTOCommon(mapHotelTypeDTO);
//
//    validateUpdate(id, mapHotelTypeDTO);
//
//    var oldMap = repository.findByHotelIdAndDeletedAtIsNull(mapHotelTypeDTO.getHotelId());
//    for (MapHotelType mapHotelType : oldMap) {
//      mapHotelType.setDeletedAt(LocalDateTime.now());
//      mapHotelType.setUpdatedAt(LocalDateTime.now());
//      mapHotelType.setUpdatedBy(authService.getAuthLogin());
//      repository.save(mapHotelType);
//    }
//
//    List<MapHotelType> newMapList = new ArrayList<>();
//    for (String typeId : mapHotelTypeDTO.getColNames()) {
//      var map = new MapHotelType();
//      map.setHotelId(mapHotelTypeDTO.getHotelId());
//      map.setColName(typeId);
//      map.setCreatedAt(LocalDateTime.now());
//      map.setCreatedBy(authService.getAuthLogin());
//      map = repository.save(map);
//      newMapList.add(map);
//    }
//
//    return newMapList;
//  }
//
//  @Override
//  protected void validateDTOCommon(MapHotelTypeDTO mapHotelTypeDTO) {
//    if (!hotelRepository.existsByIdAndDeletedAtIsNull(mapHotelTypeDTO.getHotelId()))
//      throw new AppException(ErrorCode.NOT_FOUND, "Hotel");
//
//    for (String type : mapHotelTypeDTO.getColNames()) {
//      if (!typeHotelRepository.existsByColNameAndDeletedAtIsNull(type))
//        throw new AppException(ErrorCode.NOT_FOUND, "Type Hotel");
//    }
//  }
//
//  @Override
//  protected void validateUpdate(Integer id, MapHotelTypeDTO update) {
//    if (!repository.existsByHotelIdAndDeletedAtIsNull(update.getHotelId())) {
//      throw new AppException(ErrorCode.NOT_FOUND, "Map Hotel Type");
//    }
//  }
//
//  @Override
//  protected RuntimeException createNotFoundException(Integer integer) {
//    return new AppException(ErrorCode.NOT_FOUND, "Map Hotel Type");
//  }
//}
