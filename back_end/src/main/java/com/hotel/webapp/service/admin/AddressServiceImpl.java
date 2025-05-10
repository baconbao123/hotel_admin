package com.hotel.webapp.service.admin;

import com.hotel.webapp.base.BaseMapper;
import com.hotel.webapp.base.BaseServiceImpl;
import com.hotel.webapp.dto.admin.request.AddressDTO;
import com.hotel.webapp.entity.Address;
import com.hotel.webapp.entity.Districts;
import com.hotel.webapp.entity.Streets;
import com.hotel.webapp.entity.Wards;
import com.hotel.webapp.exception.AppException;
import com.hotel.webapp.exception.ErrorCode;
import com.hotel.webapp.repository.*;
import com.hotel.webapp.service.admin.interfaces.AuthService;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.Objects;

@Service
@Transactional
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AddressServiceImpl extends BaseServiceImpl<Address, Integer, AddressDTO, AddressRepository> {
  ProvincesRepository provincesRepository;
  DistrictRepository districtRepository;
  WardRepository wardRepository;
  StreetRepository streetRepository;

  public AddressServiceImpl(
        AddressRepository repository,
        BaseMapper<Address, AddressDTO> mapper,
        AuthService authService,
        ProvincesRepository provincesRepository,
        DistrictRepository districtRepository,
        WardRepository wardRepository,
        StreetRepository streetRepository
  ) {
    super(repository, mapper, authService);
    this.provincesRepository = provincesRepository;
    this.districtRepository = districtRepository;
    this.wardRepository = wardRepository;
    this.streetRepository = streetRepository;
  }

  @Override
  protected void validateDTOCommon(AddressDTO addressDTO) {
    if (!provincesRepository.existsByCode(addressDTO.getProvinceCode()))
      throw new AppException(ErrorCode.NOT_FOUND, "Province");

    Districts districts = districtRepository.findById(addressDTO.getDistrictCode())
                                            .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND, "District"));

    if (!Objects.equals(districts.getProvinceCode(), addressDTO.getProvinceCode()))
      throw new AppException(ErrorCode.COMMON_400, "District not include in province");

    Wards wards = wardRepository.findById(addressDTO.getWardCode())
                                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND, "Ward"));

    if (!Objects.equals(wards.getDistrictCode(), addressDTO.getDistrictCode()))
      throw new AppException(ErrorCode.COMMON_400, "Ward not include in district");

    Streets streets = streetRepository.findById(addressDTO.getStreetId())
                                      .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND, "Street"));

    if (!Objects.equals(streets.getDistrictCode(), addressDTO.getDistrictCode()))
      throw new AppException(ErrorCode.COMMON_400, "Street not include in district");
  }


  @Override
  protected RuntimeException createNotFoundException(Integer integer) {
    throw new AppException(ErrorCode.NOT_FOUND, "Address");
  }
}