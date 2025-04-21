package com.hotel.webapp.service.admin;

import com.hotel.webapp.base.BaseMapper;
import com.hotel.webapp.base.BaseServiceImpl;
import com.hotel.webapp.dto.admin.request.ApproveHotelDTO;
import com.hotel.webapp.entity.ApproveHotel;
import com.hotel.webapp.exception.AppException;
import com.hotel.webapp.exception.ErrorCode;
import com.hotel.webapp.repository.ApproveHotelRepository;
import com.hotel.webapp.repository.HotelRepository;
import com.hotel.webapp.repository.UserRepository;
import com.hotel.webapp.service.admin.interfaces.AuthService;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ApproveHotelServiceImpl extends BaseServiceImpl<ApproveHotel, Integer, ApproveHotelDTO, ApproveHotelRepository> {
  HotelRepository hotelRepository;
  UserRepository userRepository;

  public ApproveHotelServiceImpl(
        ApproveHotelRepository repository,
        BaseMapper<ApproveHotel, ApproveHotelDTO> mapper,
        AuthService authService,
        HotelRepository hotelRepository,
        UserRepository userRepository
  ) {
    super(repository, mapper, authService);
    this.hotelRepository = hotelRepository;
    this.userRepository = userRepository;
  }

  @Override
  protected void validateDTOCommon(ApproveHotelDTO approveHotelDTO) {
    if (!hotelRepository.existsByIdAndDeletedAtIsNull(approveHotelDTO.getHotelId()))
      throw new AppException(ErrorCode.HOTEL_NOTFOUND);

    if (!userRepository.existsByIdAndDeletedAtIsNull(approveHotelDTO.getApproveId()))
      throw new AppException(ErrorCode.USER_NOTFOUND);
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
