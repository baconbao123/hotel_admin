package com.hotel.webapp.service.admin;

import com.hotel.webapp.base.BaseMapper;
import com.hotel.webapp.base.BaseServiceImpl;
import com.hotel.webapp.dto.request.StreetDTO;
import com.hotel.webapp.entity.Streets;
import com.hotel.webapp.exception.AppException;
import com.hotel.webapp.exception.ErrorCode;
import com.hotel.webapp.repository.DistrictRepository;
import com.hotel.webapp.repository.StreetRepository;
import com.hotel.webapp.service.admin.interfaces.AuthService;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

@Service
@Transactional
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class StreetServiceImpl extends BaseServiceImpl<Streets, Integer, StreetDTO, StreetRepository> {
  DistrictRepository districtRepository;

  public StreetServiceImpl(
        StreetRepository repository,
        BaseMapper<Streets, StreetDTO> mapper,
        AuthService authService,
        DistrictRepository districtRepository
  ) {
    super(repository, mapper, authService);
    this.districtRepository = districtRepository;
  }

  @Override
  protected void validateCreate(StreetDTO create) {
    if (repository.existsByNameAndDeletedAtIsNull(create.getName())) {
      throw new AppException(ErrorCode.FIELD_EXISTED, "Street");
    }

    if (!districtRepository.existsByCode(create.getDistrictCode())) {
      throw new AppException(ErrorCode.NOT_FOUND, "District");
    }
  }

  @Override
  protected void validateUpdate(Integer id, StreetDTO update) {
    if (repository.existsByNameAndIdNotAndDeletedAtIsNull(update.getName(), id)) {
      throw new AppException(ErrorCode.FIELD_EXISTED, "Street");
    }

    if (!districtRepository.existsByCode(update.getDistrictCode())) {
      throw new AppException(ErrorCode.NOT_FOUND, "District");
    }
  }

  @Override
  protected RuntimeException createNotFoundException(Integer integer) {
    return new AppException(ErrorCode.NOT_FOUND, "Street");
  }
}
