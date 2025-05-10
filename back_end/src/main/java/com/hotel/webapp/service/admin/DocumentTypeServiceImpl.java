package com.hotel.webapp.service.admin;

import com.hotel.webapp.base.BaseMapper;
import com.hotel.webapp.base.BaseServiceImpl;
import com.hotel.webapp.dto.admin.request.NameDTO;
import com.hotel.webapp.entity.DocumentType;
import com.hotel.webapp.entity.DocumentsHotel;
import com.hotel.webapp.exception.AppException;
import com.hotel.webapp.exception.ErrorCode;
import com.hotel.webapp.repository.DocumentTypeRepository;
import com.hotel.webapp.repository.DocumentsHotelRepository;
import com.hotel.webapp.service.admin.interfaces.AuthService;
import com.hotel.webapp.util.ValidateDataInput;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class DocumentTypeServiceImpl extends BaseServiceImpl<DocumentType, Integer, NameDTO, DocumentTypeRepository> {
  ValidateDataInput validateDataInput;
  DocumentsHotelRepository documentsHotelRepository;

  public DocumentTypeServiceImpl(
        DocumentTypeRepository repository,
        BaseMapper<DocumentType, NameDTO> mapper,
        AuthService authService,
        ValidateDataInput validateDataInput,
        DocumentsHotelRepository documentsHotelRepository
  ) {
    super(repository, mapper, authService);
    this.validateDataInput = validateDataInput;
    this.documentsHotelRepository = documentsHotelRepository;
  }

  @Override
  public DocumentType create(NameDTO create) {
    validateCreate(create);

    var documentType = DocumentType.builder()
                                   .name(create.getName())
                                   .colName(validateDataInput.generateColName(create.getName()))
                                   .createdAt(LocalDateTime.now())
                                   .createdBy(getAuthId())
                                   .build();
    return repository.save(documentType);
  }

  @Override
  public DocumentType update(Integer id, NameDTO update) {
    var documentType = getById(id);
    validateUpdate(id, update);

    documentType.setName(update.getName());
    documentType.setColName(validateDataInput.generateColName(update.getName()));
    documentType.setUpdatedAt(LocalDateTime.now());
    documentType.setUpdatedBy(getAuthId());

    return repository.save(documentType);
  }

  @Override
  protected void validateCreate(NameDTO create) {
    if (repository.existsByNameAndDeletedAtIsNull(create.getName()))
      throw new AppException(ErrorCode.FIELD_EXISTED, "Document Type");

    create.setName(validateDataInput.capitalizeFirstLetter(create.getName()));
  }

  @Override
  protected void validateUpdate(Integer id, NameDTO update) {
    if (repository.existsByNameAndIdNotAndDeletedAtIsNull(update.getName(), id))
      throw new AppException(ErrorCode.FIELD_EXISTED, "Document Type");

    update.setName(validateDataInput.capitalizeFirstLetter(update.getName()));
  }

  @Override
  protected void beforeDelete(Integer id) {
    deleteDocumentsHotel(id);
  }

  private void deleteDocumentsHotel(Integer id) {
    String colName = repository.findColNameByIdAndDeletedAtIsNull(id);

    List<DocumentsHotel> mapHotelTypes = documentsHotelRepository.findByColNameAndDeletedAtIsNull(colName);

    for (DocumentsHotel mapHotelType : mapHotelTypes) {
      mapHotelType.setDeletedAt(LocalDateTime.now());
      mapHotelType.setUpdatedAt(LocalDateTime.now());
      mapHotelType.setUpdatedBy(getAuthId());
      documentsHotelRepository.save(mapHotelType);
    }
  }

  @Override
  protected RuntimeException createNotFoundException(Integer integer) {
    return new AppException(ErrorCode.NOT_FOUND, "Document Hotel");
  }
}
