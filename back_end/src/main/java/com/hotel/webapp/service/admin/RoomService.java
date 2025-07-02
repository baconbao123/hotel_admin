package com.hotel.webapp.service.admin;

import com.hotel.webapp.base.BaseMapper;
import com.hotel.webapp.base.BaseServiceImpl;
import com.hotel.webapp.dto.request.HotelDTO;
import com.hotel.webapp.dto.request.RoomDTO;
import com.hotel.webapp.entity.MapRoomFacility;
import com.hotel.webapp.entity.RoomImages;
import com.hotel.webapp.entity.RoomType;
import com.hotel.webapp.entity.Rooms;
import com.hotel.webapp.exception.AppException;
import com.hotel.webapp.exception.ErrorCode;
import com.hotel.webapp.repository.MapRoomFacilityRepository;
import com.hotel.webapp.repository.RoomImagesRepository;
import com.hotel.webapp.repository.RoomRepository;
import com.hotel.webapp.repository.seeder.RoomTypeRepository;
import com.hotel.webapp.service.admin.interfaces.AuthService;
import com.hotel.webapp.service.system.StorageFileService;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RoomService extends BaseServiceImpl<Rooms, Integer, RoomDTO, RoomRepository> {
  StorageFileService storageFileService;
  MapRoomFacilityRepository mapRoomFacilityRepository;
  RoomImagesRepository roomImagesRepository;
  RoomTypeRepository roomTypeRepository;

  public RoomService(
        RoomRepository repository, BaseMapper<Rooms, RoomDTO> mapper,
        AuthService authService, StorageFileService storageFileService,
        MapRoomFacilityRepository mapRoomFacilityRepository,
        RoomImagesRepository roomImagesRepository,
        RoomTypeRepository roomTypeRepository
  ) {
    super(repository, mapper, authService);
    this.storageFileService = storageFileService;
    this.mapRoomFacilityRepository = mapRoomFacilityRepository;
    this.roomImagesRepository = roomImagesRepository;
    this.roomTypeRepository = roomTypeRepository;
  }

  @Override
  protected void beforeCreate(Rooms entity, RoomDTO roomDTO) {
    if (roomDTO.getRoomAvatar() != null && !roomDTO.getRoomAvatar().isEmpty()) {
      String name = storageFileService.uploadHotelImg(roomDTO.getRoomAvatar());
      entity.setRoomAvatar(name);
    }
  }

  @Override
  protected void afterCreate(Rooms rooms, RoomDTO create) {
    for (Integer mhf : create.getFacilities()) {
      MapRoomFacility mapRoomFacility = new MapRoomFacility();
      mapRoomFacility.setFacilityId(mhf);
      mapRoomFacility.setRoomId(rooms.getId());
      mapRoomFacilityRepository.save(mapRoomFacility);
    }

    if (create.getImages() != null) {
      for (HotelDTO.ImagesReq image : create.getImages()) {
        String imgStr = storageFileService.uploadHotelImg(image.getImageFile());

        RoomImages roomImages = RoomImages.builder()
                                          .name(imgStr)
                                          .roomId(rooms.getId())
                                          .createdAt(LocalDateTime.now())
                                          .createdBy(getAuthId())
                                          .build();
        roomImagesRepository.save(roomImages);
      }
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
    // facilities
    var crrMapFacilities = mapRoomFacilityRepository.findByRoomIdAndDeletedAtIsNull(entity.getId());

    for (MapRoomFacility mapRoomFacility : crrMapFacilities) {
      mapRoomFacility.setDeletedAt(LocalDateTime.now());
      mapRoomFacility.setUpdatedBy(getAuthId());
      mapRoomFacilityRepository.save(mapRoomFacility);
    }

    for (Integer newMapping : roomDTO.getFacilities()) {
      MapRoomFacility mapRoomFacility = MapRoomFacility.builder()
                                                       .facilityId(newMapping)
                                                       .roomId(entity.getId())
                                                       .createdAt(LocalDateTime.now())
                                                       .updatedBy(getAuthId())
                                                       .build();
      mapRoomFacilityRepository.save(mapRoomFacility);
    }

    // hotelImage
    List<RoomImages> existingImages = roomImagesRepository.findAllByRoomIdAndDeletedAtIsNull(entity.getId());
    List<Integer> incomingImageIds = roomDTO.getImages() != null
          ? roomDTO.getImages().stream()
                   .filter(img -> img.getImageId() != null)
                   .map(HotelDTO.ImagesReq::getImageId)
                   .toList()
          : new ArrayList<>();

    for (RoomImages existingImage : existingImages) {
      if (!incomingImageIds.contains(existingImage.getId())) {
        existingImage.setDeletedAt(LocalDateTime.now());
        existingImage.setUpdatedBy(getAuthId());
        roomImagesRepository.save(existingImage);
      }
    }

    if (roomDTO.getImages() != null) {
      for (HotelDTO.ImagesReq imgReq : roomDTO.getImages()) {
        RoomImages roomImage;
        if (imgReq.getImageId() != null) {
          roomImage = roomImagesRepository.findById(imgReq.getImageId())
                                          .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND, "Image"));
          if (imgReq.getExistingImageUrl() != null && !imgReq.getExistingImageUrl().isEmpty()) {
            roomImage.setName(imgReq.getExistingImageUrl());
          }
        } else {
          if (imgReq.getImageFile() != null && !imgReq.getImageFile().isEmpty()) {
            roomImage = new RoomImages();
            roomImage.setRoomId(entity.getId());
            roomImage.setName(storageFileService.uploadHotelImg(imgReq.getImageFile()));
            roomImage.setCreatedAt(LocalDateTime.now());
            roomImage.setCreatedBy(getAuthId());
          } else {
            continue;
          }
        }
        roomImage.setUpdatedAt(LocalDateTime.now());
        roomImage.setUpdatedBy(getAuthId());
        roomImagesRepository.save(roomImage);
      }
    }
  }

  public Page<Rooms> findRoomsByHotelId(Integer hotelId, Map<String, String> filters, Map<String, String> sort,
        int size, int page) {
    Map<String, Object> filterMap = removedFiltersKey(filters);
    Map<String, Object> sortMap = removedSortedKey(sort);

    Specification<Rooms> spec = buildSpecification(filterMap);
    Pageable defaultPage = buildPageable(sortMap, page, size);

    return repository.findByHotelId(hotelId, spec, defaultPage);
  }

  public List<RoomType> findRoomTypes() {
    return roomTypeRepository.findRoomTypes();
  }


  @Override
  protected RuntimeException createNotFoundException(Integer integer) {
    throw new AppException(ErrorCode.NOT_FOUND, "Room");
  }
}
