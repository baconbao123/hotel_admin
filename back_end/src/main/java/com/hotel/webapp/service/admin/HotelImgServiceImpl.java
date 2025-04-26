package com.hotel.webapp.service.admin;

import com.hotel.webapp.dto.admin.request.HotelImgsDto;
import com.hotel.webapp.dto.admin.request.MapHotelImgDTO;
import com.hotel.webapp.entity.HotelImages;
import com.hotel.webapp.entity.MapHotelImages;
import com.hotel.webapp.exception.AppException;
import com.hotel.webapp.exception.ErrorCode;
import com.hotel.webapp.repository.HotelImagesRepository;
import com.hotel.webapp.repository.HotelRepository;
import com.hotel.webapp.repository.MapHotelImagesRepository;
import com.hotel.webapp.service.admin.interfaces.AuthService;
import com.hotel.webapp.service.system.StorageFileService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class HotelImgServiceImpl {
  HotelImagesRepository hotelImagesRepository;
  MapHotelImagesRepository mapHotelImagesRepository;
  StorageFileService storageFileService;
  HotelRepository hotelRepository;
  AuthService authService;

  public void uploadHotelAvatar(MultipartFile hotelAvatar) {
    if (hotelAvatar != null && !hotelAvatar.isEmpty()) {
      String filePath = storageFileService.uploadHotelImg(hotelAvatar);
      HotelImages hotelImg = HotelImages.builder()
                                        .name(filePath)
                                        .type("avatar")
                                        .createdAt(LocalDateTime.now())
                                        .createdBy(authService.getAuthLogin())
                                        .build();

      hotelImagesRepository.save(hotelImg);
    }

    if (hotelAvatar == null || hotelAvatar.isEmpty()) {
      throw new AppException(ErrorCode.AVATAR_NOT_EMPTY);
    }
  }

  public void updateHotelAvatar(Integer id, MultipartFile hotelAvatar) {
    if (hotelAvatar == null || hotelAvatar.isEmpty()) {
      throw new AppException(ErrorCode.AVATAR_NOT_EMPTY);
    }

    var hotelImg = getById(id);
    hotelImg.setUpdatedAt(LocalDateTime.now());
    hotelImg.setUpdatedBy(authService.getAuthLogin());
    hotelImg.setDeletedAt(LocalDateTime.now());
    hotelImagesRepository.save(hotelImg);

    if (!hotelAvatar.isEmpty()) {
      String filePath = storageFileService.uploadHotelImg(hotelAvatar);
      HotelImages hotelAvatarNew = HotelImages.builder()
                                              .name(filePath)
                                              .type("avatar")
                                              .createdAt(LocalDateTime.now())
                                              .createdBy(authService.getAuthLogin())
                                              .build();
      hotelImagesRepository.save(hotelAvatarNew);
    }


  }

  public void deleteAvatar(Integer id) {
    var hotelImg = getById(id);
    hotelImg.setDeletedAt(LocalDateTime.now());
    hotelImg.setUpdatedBy(authService.getAuthLogin());
    hotelImagesRepository.save(hotelImg);
  }

  public void uploadHotelImages(HotelImgsDto images) {
    var hotelImg = new HotelImages();
    if (images.getHotelImgs() != null && !images.getHotelImgs().isEmpty()) {
      for (MultipartFile file : images.getHotelImgs()) {
        String filePath = storageFileService.uploadHotelImg(file);
        hotelImg.setName(filePath);
        hotelImg.setType(images.getType());
        hotelImg.setCreatedAt(LocalDateTime.now());
        hotelImg.setCreatedBy(authService.getAuthLogin());
        hotelImagesRepository.save(hotelImg);
      }
    }
  }

  public HotelImages getById(Integer id) {
    return hotelImagesRepository.findById(id)
                                .filter(h -> h.getDeletedAt() == null)
                                .orElseThrow(() -> new AppException(ErrorCode.IMAGE_NOTFOUND));
  }

  // map images with hotel
  public void mapHotelImages(MapHotelImgDTO dto) {
    if (!hotelRepository.existsByIdAndDeletedAtIsNull(dto.getHotelId()))
      throw new AppException(ErrorCode.HOTEL_NOTFOUND);

    for (Integer imgId : dto.getHotelImgs()) {
      if (!hotelImagesRepository.existsByIdAndDeletedAtIsNull(imgId))
        throw new AppException(ErrorCode.IMAGE_NOTFOUND);
    }

    for (Integer imgId : dto.getHotelImgs()) {
      var mapHotelImages = new MapHotelImages();
      mapHotelImages.setHotelId(dto.getHotelId());
      mapHotelImages.setImageId(imgId);
      mapHotelImages.setCreatedAt(LocalDateTime.now());
      mapHotelImages.setCreatedBy(authService.getAuthLogin());
      mapHotelImagesRepository.save(mapHotelImages);
    }
  }

  public void updateMapHotelImages(MapHotelImgDTO dto) {
    if (!hotelRepository.existsByIdAndDeletedAtIsNull(dto.getHotelId()))
      throw new AppException(ErrorCode.HOTEL_NOTFOUND);

    if (!mapHotelImagesRepository.existsByHotelIdAndDeletedAtIsNull(dto.getHotelId()))
      throw new AppException(ErrorCode.MAPPING_IMG_NOTFOUND);

    for (Integer imgId : dto.getHotelImgs()) {
      if (!hotelImagesRepository.existsByIdAndDeletedAtIsNull(imgId))
        throw new AppException(ErrorCode.IMAGE_NOTFOUND);
    }

    var oldMaps = mapHotelImagesRepository.findByHotelIdAndDeletedAtIsNull(dto.getHotelId());
    for (MapHotelImages mapHotelImages : oldMaps) {
      mapHotelImages.setDeletedAt(LocalDateTime.now());
      mapHotelImages.setUpdatedAt(LocalDateTime.now());
      mapHotelImages.setUpdatedBy(authService.getAuthLogin());
      mapHotelImagesRepository.save(mapHotelImages);
    }

    for (Integer imgId : dto.getHotelImgs()) {
      var mapHotelImages = new MapHotelImages();
      mapHotelImages.setHotelId(dto.getHotelId());
      mapHotelImages.setImageId(imgId);
      mapHotelImages.setCreatedAt(LocalDateTime.now());
      mapHotelImages.setCreatedBy(authService.getAuthLogin());
      mapHotelImagesRepository.save(mapHotelImages);
    }
  }
}
