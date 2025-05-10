package com.hotel.webapp.service.admin;

import com.hotel.webapp.base.BaseServiceImpl;
import com.hotel.webapp.dto.admin.request.NameDTO;
import com.hotel.webapp.entity.MapHotelType;
import com.hotel.webapp.entity.TypeHotel;
import com.hotel.webapp.exception.AppException;
import com.hotel.webapp.exception.ErrorCode;
import com.hotel.webapp.repository.MapHotelTypeRepository;
import com.hotel.webapp.repository.TypeHotelRepository;
import com.hotel.webapp.service.admin.interfaces.AuthService;
import com.hotel.webapp.util.ValidateDataInput;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class TypeHotelServiceImpl extends BaseServiceImpl<TypeHotel, Integer, NameDTO, TypeHotelRepository> {
  ValidateDataInput validateDataInput;
  MapHotelTypeRepository mapHotelTypeRepository;

  public TypeHotelServiceImpl(
        TypeHotelRepository repository,
        AuthService authService,
        ValidateDataInput validateDataInput,
        MapHotelTypeRepository mapHotelTypeRepository
  ) {
    super(repository, authService);
    this.validateDataInput = validateDataInput;
    this.mapHotelTypeRepository = mapHotelTypeRepository;
  }

  @Override
  public TypeHotel create(NameDTO create) {
    validateCreate(create);

    var typeHotel = TypeHotel.builder()
                             .name(create.getName())
                             .colName(validateDataInput.generateColName(create.getName()))
                             .createdAt(LocalDateTime.now())
                             .createdBy(getAuthId())
                             .build();
    return repository.save(typeHotel);
  }

  @Override
  public TypeHotel update(Integer id, NameDTO update) {
    var typeHotel = getById(id);
    validateUpdate(id, update);

    typeHotel.setName(update.getName());
    typeHotel.setColName(validateDataInput.generateColName(update.getName()));
    typeHotel.setUpdatedAt(LocalDateTime.now());
    typeHotel.setUpdatedBy(getAuthId());

    return repository.save(typeHotel);
  }

  @Override
  protected void beforeDelete(Integer id) {
    deleteMapHotelType(id);
  }

  private void deleteMapHotelType(Integer id) {
    String colName = repository.findColNameById(id);

    List<MapHotelType> mapHotelTypes = mapHotelTypeRepository.findByColNameAndDeletedAtIsNull(colName);

    for (MapHotelType mapHotelType : mapHotelTypes) {
      mapHotelType.setDeletedAt(LocalDateTime.now());
      mapHotelType.setUpdatedAt(LocalDateTime.now());
      mapHotelType.setUpdatedBy(getAuthId());
      mapHotelTypeRepository.save(mapHotelType);
    }
  }

  @Override
  protected void validateCreate(NameDTO create) {
    if (repository.existsByNameAndDeletedAtIsNull(create.getName()))
      throw new AppException(ErrorCode.FIELD_EXISTED, "Type Hotel");
  }

  @Override
  protected void validateUpdate(Integer id, NameDTO update) {
    if (repository.existsByNameAndIdNotAndDeletedAtIsNull(update.getName(), id))
      throw new AppException(ErrorCode.FIELD_EXISTED, "Type Hotel");
  }

  @Override
  protected RuntimeException createNotFoundException(Integer integer) {
    return new AppException(ErrorCode.NOT_FOUND, "Type Hotel");
  }
}
