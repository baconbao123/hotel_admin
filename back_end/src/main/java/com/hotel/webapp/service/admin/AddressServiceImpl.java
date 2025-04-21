package com.hotel.webapp.service.admin;

import com.hotel.webapp.base.BaseMapper;
import com.hotel.webapp.base.BaseServiceImpl;
import com.hotel.webapp.dto.admin.request.AddressDTO;
import com.hotel.webapp.entity.Address;
import com.hotel.webapp.exception.AppException;
import com.hotel.webapp.exception.ErrorCode;
import com.hotel.webapp.repository.*;
import com.hotel.webapp.service.admin.interfaces.AuthService;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

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
  protected void validateCreate(AddressDTO create) {
    if (!provincesRepository.existsByCode(create.getProvinceCode()))
      throw new AppException(ErrorCode.PROVINCE_NOTFOUND);

    if (!districtRepository.existsByCode(create.getDistrictCode()))
      throw new AppException(ErrorCode.DISTRICT_NOTFOUND);

    if (!wardRepository.existsByCode(create.getWardCode()))
      throw new AppException(ErrorCode.WARD_NOTFOUND);

    if (!streetRepository.existsById(create.getStreetId()))
      throw new AppException(ErrorCode.STREET_NOTFOUND);
  }

  @Override
  protected void validateUpdate(Integer id, AddressDTO update) {
    if (!provincesRepository.existsByCode(update.getProvinceCode()))
      throw new AppException(ErrorCode.PROVINCE_NOTFOUND);

    if (!districtRepository.existsByCode(update.getDistrictCode()))
      throw new AppException(ErrorCode.DISTRICT_NOTFOUND);

    if (!wardRepository.existsByCode(update.getWardCode()))
      throw new AppException(ErrorCode.WARD_NOTFOUND);

    if (!streetRepository.existsById(update.getStreetId()))
      throw new AppException(ErrorCode.STREET_NOTFOUND);
  }

  @Override
  protected void validateDelete(Integer integer) {
  }

  @Override
  protected RuntimeException createNotFoundException(Integer integer) {
    return null;
  }
}