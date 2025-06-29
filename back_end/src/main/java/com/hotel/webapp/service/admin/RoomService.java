package com.hotel.webapp.service.admin;

import com.hotel.webapp.base.BaseMapper;
import com.hotel.webapp.base.BaseServiceImpl;
import com.hotel.webapp.dto.request.RoomDTO;
import com.hotel.webapp.entity.MapRoomFacility;
import com.hotel.webapp.entity.Rooms;
import com.hotel.webapp.exception.AppException;
import com.hotel.webapp.exception.ErrorCode;
import com.hotel.webapp.repository.MapRoomFacilityRepository;
import com.hotel.webapp.repository.RoomRepository;
import com.hotel.webapp.service.admin.interfaces.AuthService;
import com.hotel.webapp.service.system.StorageFileService;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RoomService extends BaseServiceImpl<Rooms, Integer, RoomDTO, RoomRepository> {
  StorageFileService storageFileService;
  MapRoomFacilityRepository mapRoomFacilityRepository;

  public RoomService(RoomRepository repository, BaseMapper<Rooms, RoomDTO> mapper,
        AuthService authService, StorageFileService storageFileService,
        MapRoomFacilityRepository mapRoomFacilityRepository) {
    super(repository, mapper, authService);
    this.storageFileService = storageFileService;
    this.mapRoomFacilityRepository = mapRoomFacilityRepository;
  }

  @Override
  protected void afterCreate(Rooms rooms, RoomDTO create) {
    for (Integer mhf : create.getFacilities()) {
      MapRoomFacility mapRoomFacility = new MapRoomFacility();
      mapRoomFacility.setFacilityId(mhf);
      mapRoomFacility.setRoomId(rooms.getId());
      mapRoomFacilityRepository.save(mapRoomFacility);
    }
  }

  @Override
  protected void beforeCreate(Rooms entity, RoomDTO roomDTO) {
    if (roomDTO.getRoomAvatar() != null && !roomDTO.getRoomAvatar().isEmpty()) {
      String name = storageFileService.uploadHotelImg(roomDTO.getRoomAvatar());
      entity.setRoomAvatar(name);
    }
  }

  // update
  @Override
  protected void beforeUpdate(Rooms rooms, RoomDTO update) {
    if (update.getKeepAvatar().equals("false") && update.getRoomAvatar() != null && !update.getRoomAvatar().isEmpty()) {
      String name = storageFileService.uploadHotelImg(update.getRoomAvatar());
      rooms.setRoomAvatar(name);
    }
  }

  @Override
  protected void afterUpdate(Rooms entity, RoomDTO roomDTO) {
    // handle facilties
  }

  @Override
  protected RuntimeException createNotFoundException(Integer integer) {
    throw new AppException(ErrorCode.NOT_FOUND, "Room");
  }


}
