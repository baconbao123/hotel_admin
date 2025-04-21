package com.hotel.webapp.service.admin;

import com.hotel.webapp.base.BaseMapper;
import com.hotel.webapp.base.BaseServiceImpl;
import com.hotel.webapp.dto.admin.request.NameDTO;
import com.hotel.webapp.entity.TypeHotel;
import com.hotel.webapp.exception.AppException;
import com.hotel.webapp.exception.ErrorCode;
import com.hotel.webapp.repository.TypeHotelRepository;
import com.hotel.webapp.service.admin.interfaces.AuthService;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class TypeHotelServiceImpl extends BaseServiceImpl<TypeHotel, Integer, NameDTO, TypeHotelRepository> {

  public TypeHotelServiceImpl(
        TypeHotelRepository repository,
        BaseMapper<TypeHotel, NameDTO> mapper,
        AuthService authService) {
    super(repository, mapper, authService);
  }

  @Override
  protected void validateCreate(NameDTO create) {
    if (repository.existsByNameAndDeletedAtIsNull(create.getName()))
      throw new AppException(ErrorCode.TYPE_EXISTED);
  }

  @Override
  protected void validateUpdate(Integer id, NameDTO update) {
    if (repository.existsByNameAndIdNotAndDeletedAtIsNull(update.getName(), id))
      throw new AppException(ErrorCode.TYPE_EXISTED);
  }

  @Override
  protected void validateDelete(Integer integer) {

  }

  @Override
  protected RuntimeException createNotFoundException(Integer integer) {
    return new AppException(ErrorCode.TYPE_NOTFOUND);
  }
}
