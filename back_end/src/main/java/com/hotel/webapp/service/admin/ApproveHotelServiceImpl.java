package com.hotel.webapp.service.admin;

import com.hotel.webapp.base.BaseMapper;
import com.hotel.webapp.base.BaseServiceImpl;
import com.hotel.webapp.dto.request.ApproveHotelDTO;
import com.hotel.webapp.entity.ApproveHotel;
import com.hotel.webapp.entity.Hotels;
import com.hotel.webapp.entity.shared.HotelMapUserRoles;
import com.hotel.webapp.entity.shared.HotelRoles;
import com.hotel.webapp.entity.shared.HotelUser;
import com.hotel.webapp.entity.shared.MapHotelUser;
import com.hotel.webapp.exception.AppException;
import com.hotel.webapp.exception.ErrorCode;
import com.hotel.webapp.repository.ApproveHotelRepository;
import com.hotel.webapp.repository.HotelRepository;
import com.hotel.webapp.repository.UserRepository;
import com.hotel.webapp.repository.shared.HotelMapUserRolesRepository;
import com.hotel.webapp.repository.shared.HotelRolesRepository;
import com.hotel.webapp.repository.shared.HotelUserRepository;
import com.hotel.webapp.repository.shared.MapHotelUserRepository;
import com.hotel.webapp.service.admin.interfaces.AuthService;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Objects;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ApproveHotelServiceImpl extends BaseServiceImpl<ApproveHotel, Integer, ApproveHotelDTO, ApproveHotelRepository> {
  HotelRepository hotelRepository;
  UserRepository userRepository;
  HotelUserRepository hotelUserRepository;
  MapHotelUserRepository mapHotelUserRepository;
  HotelRolesRepository hotelRolesRepository;
  HotelMapUserRolesRepository hotelMapUserRolesRepository;

  public ApproveHotelServiceImpl(
        ApproveHotelRepository repository,
        BaseMapper<ApproveHotel, ApproveHotelDTO> mapper,
        AuthService authService,
        HotelRepository hotelRepository,
        UserRepository userRepository,
        HotelUserRepository hotelUserRepository,
        MapHotelUserRepository mapHotelUserRepository,
        HotelRolesRepository hotelRolesRepository,
        HotelMapUserRolesRepository hotelMapUserRolesRepository
  ) {
    super(repository, mapper, authService);
    this.hotelRepository = hotelRepository;
    this.userRepository = userRepository;
    this.hotelUserRepository = hotelUserRepository;
    this.mapHotelUserRepository = mapHotelUserRepository;
    this.hotelRolesRepository = hotelRolesRepository;
    this.hotelMapUserRolesRepository = hotelMapUserRolesRepository;
  }

  @Override
  protected void validateDTOCommon(ApproveHotelDTO approveHotelDTO) {
    if (!hotelRepository.existsByIdAndDeletedAtIsNull(approveHotelDTO.getHotelId()))
      throw new AppException(ErrorCode.NOT_FOUND, "Hotel");

    if (!userRepository.existsByIdAndDeletedAtIsNull(approveHotelDTO.getApproveId()))
      throw new AppException(ErrorCode.NOT_FOUND, "User");
  }

  @Transactional
  @Override
  protected void afterCreate(ApproveHotel entity, ApproveHotelDTO approveHotelDTO) {
    if (Boolean.TRUE.equals(entity.getApproved())) {
      Hotels hotels =
            hotelRepository.findById(approveHotelDTO.getHotelId())
                           .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND, "Hotel"));

      var ownerId = 0;
      if (Objects.equals(entity.getHotelId(), hotels.getId())) {
        ownerId = hotels.getOwnerId();
      }

      var user = userRepository.findById(ownerId).orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND, "User"));

      HotelUser hotelUser = HotelUser.builder()
                                     .email(user.getEmail())
                                     .phoneNumber(user.getPhoneNumber())
                                     .password(user.getPassword())
                                     .fullName(user.getFullName())
                                     .avatarUrl(user.getAvatarUrl())
                                     .createdAt(LocalDateTime.now())
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

      var hotelRoles = HotelRoles.builder()
                                 .name("sa_hotel")
                                 .hotelId(hotels.getId())
                                 .status(true)
                                 .createdAt(LocalDateTime.now())
                                 .createdBy(getAuthId())
                                 .build();
      hotelRolesRepository.save(hotelRoles);

      var hotelMapHotelRole = HotelMapUserRoles.builder()
                                               .roleId(hotelRoles.getId())
                                               .userId(hotelUser.getId())
                                               .createdAt(LocalDateTime.now())
                                               .createdBy(getAuthId())
                                               .build();
      hotelMapUserRolesRepository.save(hotelMapHotelRole);
    }
  }

  @Override
  protected void afterUpdate(ApproveHotel entity, ApproveHotelDTO approveHotelDTO) {
    if (Boolean.FALSE.equals(approveHotelDTO.getApproved()) && Boolean.TRUE.equals(entity.getApproved())) {
      throw new AppException(ErrorCode.COMMON_400, "Cannot update a hotel that has already been approved");
    }

    afterCreate(entity, approveHotelDTO);
  }

  @Override
  protected RuntimeException createNotFoundException(Integer integer) {
    return new AppException(ErrorCode.NOT_FOUND, "Approve");
  }
}
