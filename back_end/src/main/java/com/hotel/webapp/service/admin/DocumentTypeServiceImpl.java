package com.hotel.webapp.service.admin;

import com.hotel.webapp.base.BaseMapper;
import com.hotel.webapp.base.BaseServiceImpl;
import com.hotel.webapp.dto.admin.request.NameDTO;
import com.hotel.webapp.entity.DocumentType;
import com.hotel.webapp.exception.AppException;
import com.hotel.webapp.exception.ErrorCode;
import com.hotel.webapp.repository.DocumentTypeRepository;
import com.hotel.webapp.service.admin.interfaces.AuthService;
import com.hotel.webapp.util.ValidateDataInput;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class DocumentTypeServiceImpl extends BaseServiceImpl<DocumentType, Integer, NameDTO, DocumentTypeRepository> {
  ValidateDataInput validateDataInput;

  public DocumentTypeServiceImpl(
        DocumentTypeRepository repository,
        BaseMapper<DocumentType, NameDTO> mapper,
        AuthService authService,
        ValidateDataInput validateDataInput
  ) {
    super(repository, mapper, authService);
    this.validateDataInput = validateDataInput;
  }

  @Override
  protected void validateCreate(NameDTO create) {
    if (repository.existsByNameAndDeletedAtIsNull(create.getName()))
      throw new AppException(ErrorCode.DOCUMENTS_EXISTED);

    create.setName(validateDataInput.capitalizeFirstLetter(create.getName()));
  }

  @Override
  protected void validateUpdate(Integer id, NameDTO update) {
    if (repository.existsByNameAndIdNotAndDeletedAtIsNull(update.getName(), id))
      throw new AppException(ErrorCode.DOCUMENTS_EXISTED);

    update.setName(validateDataInput.capitalizeFirstLetter(update.getName()));
  }

  @Override
  protected void validateDelete(Integer integer) {

  }

  @Override
  protected RuntimeException createNotFoundException(Integer integer) {
    return new AppException(ErrorCode.DOCUMENTS_TYPE_NOTFOUND);
  }
}
