package com.hotel.webapp.service.admin;

import com.hotel.webapp.base.BaseMapper;
import com.hotel.webapp.base.BaseServiceImpl;
import com.hotel.webapp.dto.admin.request.HotelDTO;
import com.hotel.webapp.entity.HotelPolicy;
import com.hotel.webapp.entity.Hotels;
import com.hotel.webapp.exception.AppException;
import com.hotel.webapp.exception.ErrorCode;
import com.hotel.webapp.repository.*;
import com.hotel.webapp.service.admin.interfaces.AuthService;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class HotelServiceImpl extends BaseServiceImpl<Hotels, Integer, HotelDTO, HotelRepository> {
  HotelImagesRepository hotelImagesRepository;
  UserRepository userRepository;
  AddressRepository addressRepository;
  HotelPolicyRepository policyRepository;

  public HotelServiceImpl(
        HotelRepository repository,
        BaseMapper<Hotels, HotelDTO> mapper,
        AuthService authService,
        HotelImagesRepository hotelImagesRepository,
        UserRepository userRepository,
        AddressRepository addressRepository,
        HotelPolicyRepository policyRepository
  ) {
    super(repository, mapper, authService);
    this.hotelImagesRepository = hotelImagesRepository;
    this.userRepository = userRepository;
    this.addressRepository = addressRepository;
    this.policyRepository = policyRepository;
  }

  @Override
  protected void validateCreate(HotelDTO create) {
    HotelPolicy hotelPolicy = policyRepository.findById(create.getPolicyId())
                                              .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND, "Policy"));
    if (hotelPolicy.getHotelId() != null)
      throw new AppException(ErrorCode.FIELD_USED, "The policy");
  }

  @Override
  protected void afterCreate(Hotels hotel, HotelDTO create) {
    HotelPolicy hotelPolicy = policyRepository.findById(create.getPolicyId())
                                              .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND, "Policy"));
    hotelPolicy.setHotelId(hotel.getId());
  }

  @Override
  protected void validateDTOCommon(HotelDTO hotelDTO) {
    if (hotelDTO.getAvatarId() != null &&
          !hotelImagesRepository.existsByIdAndDeletedAtIsNull(hotelDTO.getAvatarId()))
      throw new AppException(ErrorCode.NOT_FOUND, "Image");


    if (hotelDTO.getOwnerId() != null &&
          !userRepository.existsByIdAndIsActiveIsTrueAndDeletedAtIsNull(hotelDTO.getOwnerId()))
      throw new AppException(ErrorCode.NOT_FOUND, "User");


    if (hotelDTO.getAddressId() != null &&
          !addressRepository.existsByIdAndDeletedAtIsNull(hotelDTO.getAddressId()))
      throw new AppException(ErrorCode.NOT_FOUND, "Address");

    if (hotelDTO.getPolicyId() != null && !policyRepository.existsByIdAndDeletedAtIsNull(hotelDTO.getPolicyId())) {
      throw new AppException(ErrorCode.NOT_FOUND, "Policy");
    }
  }

  @Override
  protected RuntimeException createNotFoundException(Integer integer) {
    return new AppException(ErrorCode.NOT_FOUND, "Hotel");
  }
}
