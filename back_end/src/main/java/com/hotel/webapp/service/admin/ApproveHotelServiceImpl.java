package com.hotel.webapp.service.admin;

import com.hotel.webapp.base.BaseMapper;
import com.hotel.webapp.base.BaseServiceImpl;
import com.hotel.webapp.dto.admin.request.ApproveHotelDTO;
import com.hotel.webapp.entity.ApproveHotel;
import com.hotel.webapp.entity.Hotels;
import com.hotel.webapp.entity.shared.HotelUser;
import com.hotel.webapp.entity.shared.MapHotelUser;
import com.hotel.webapp.exception.AppException;
import com.hotel.webapp.exception.ErrorCode;
import com.hotel.webapp.repository.*;
import com.hotel.webapp.service.admin.interfaces.AuthService;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.Objects;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ApproveHotelServiceImpl extends BaseServiceImpl<ApproveHotel, Integer, ApproveHotelDTO, ApproveHotelRepository> {
  HotelRepository hotelRepository;
  UserRepository userRepository;
  HotelUserRepository hotelUserRepository;
  MapHotelUserRepository mapHotelUserRepository;

  public ApproveHotelServiceImpl(
        ApproveHotelRepository repository,
        BaseMapper<ApproveHotel, ApproveHotelDTO> mapper,
        AuthService authService,
        HotelRepository hotelRepository,
        UserRepository userRepository,
        HotelUserRepository hotelUserRepository,
        MapHotelUserRepository mapHotelUserRepository
  ) {
    super(repository, mapper, authService);
    this.hotelRepository = hotelRepository;
    this.userRepository = userRepository;
    this.hotelUserRepository = hotelUserRepository;
    this.mapHotelUserRepository = mapHotelUserRepository;
  }

  @Override
  protected void validateDTOCommon(ApproveHotelDTO approveHotelDTO) {
    if (!hotelRepository.existsByIdAndDeletedAtIsNull(approveHotelDTO.getHotelId()))
      throw new AppException(ErrorCode.HOTEL_NOTFOUND);

    if (!userRepository.existsByIdAndDeletedAtIsNull(approveHotelDTO.getApproveId()))
      throw new AppException(ErrorCode.USER_NOTFOUND);
  }

  @Override
  protected void afterCreate(ApproveHotel entity, ApproveHotelDTO approveHotelDTO) {
    if (Boolean.TRUE.equals(entity.getApproved())) {
      Hotels hotels =
            hotelRepository.findById(approveHotelDTO.getHotelId())
                           .orElseThrow(() -> new AppException(ErrorCode.HOTEL_NOTFOUND));

      var ownerId = 0;
      if (Objects.equals(entity.getHotelId(), hotels.getId())) {
        ownerId = hotels.getOwnerId();
      }

      var user = userRepository.findById(ownerId).orElseThrow(() -> new AppException(ErrorCode.USER_NOTFOUND));

      HotelUser hotelUser = HotelUser.builder()
//      hotelUser.setId(user.getId());

                                     .email(user.getEmail())
                                     .phoneNumber(user.getPhoneNumber())
                                     .password(user.getPassword())
                                     .fullName(user.getFullName())
                                     .avatarUrl(user.getAvatarUrl())
                                     .createdAt(Instant.now())
                                     .createdBy(getAuthId())
                                     .build();
      hotelUser = hotelUserRepository.save(hotelUser);

      var mapHotelUser = MapHotelUser.builder()
                                     .hotelId(hotels.getId())
                                     .userId(hotelUser.getId())
                                     .createdAt(LocalDateTime.now())
                                     .createdBy(getAuthId())
                                     .build();

      mapHotelUserRepository.save(mapHotelUser);
    }
  }

  @Override
  protected void afterUpdate(ApproveHotel entity, ApproveHotelDTO approveHotelDTO) {
    if (Boolean.FALSE.equals(approveHotelDTO.getApproved()) && Boolean.TRUE.equals(entity.getApproved())) {
      throw new AppException(ErrorCode.HOTEL_APPROVED);
    }

    afterCreate(entity, approveHotelDTO);
  }

  @Override
  protected void validateCreate(ApproveHotelDTO create) {
  }

  @Override
  protected void validateUpdate(Integer id, ApproveHotelDTO update) {
  }

  @Override
  protected void validateDelete(Integer integer) {
  }

  @Override
  protected RuntimeException createNotFoundException(Integer integer) {
    return new AppException(ErrorCode.APPROVE_NOTFOUND);
  }
}
