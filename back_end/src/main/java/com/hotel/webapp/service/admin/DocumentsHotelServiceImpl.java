package com.hotel.webapp.service.admin;

import com.hotel.webapp.base.BaseMapper;
import com.hotel.webapp.base.BaseServiceImpl;
import com.hotel.webapp.dto.admin.request.DocumentsHotelDTO;
import com.hotel.webapp.entity.DocumentsHotel;
import com.hotel.webapp.exception.AppException;
import com.hotel.webapp.exception.ErrorCode;
import com.hotel.webapp.repository.DocumentTypeRepository;
import com.hotel.webapp.repository.DocumentsHotelRepository;
import com.hotel.webapp.repository.HotelRepository;
import com.hotel.webapp.service.admin.interfaces.AuthService;
import com.hotel.webapp.service.system.StorageFileService;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class DocumentsHotelServiceImpl extends BaseServiceImpl<DocumentsHotel, Integer, DocumentsHotelDTO, DocumentsHotelRepository> {
  HotelRepository hotelRepository;
  DocumentTypeRepository documentTypeRepository;
  StorageFileService storageFileService;

  public DocumentsHotelServiceImpl(
        DocumentsHotelRepository repository,
        BaseMapper<DocumentsHotel, DocumentsHotelDTO> mapper,
        AuthService authService,
        HotelRepository hotelRepository,
        DocumentTypeRepository documentTypeRepository,
        StorageFileService storageFileService
  ) {
    super(repository, mapper, authService);
    this.hotelRepository = hotelRepository;
    this.documentTypeRepository = documentTypeRepository;
    this.storageFileService = storageFileService;
  }

  @Override
  public DocumentsHotel create(DocumentsHotelDTO create) {
    validateDTOCommon(create);
    var documentsHotel = mapper.toCreate(create);

    if (create.getDocumentUrl() != null && !create.getDocumentUrl().isEmpty()) {
      String filePath = storageFileService.uploadDocument(create.getDocumentUrl());
      documentsHotel.setDocumentUrl(filePath);
    }

    documentsHotel.setCreatedAt(LocalDateTime.now());
    documentsHotel.setCreatedBy(authService.getAuthLogin());

    return repository.save(documentsHotel);
  }

  @Override
  public DocumentsHotel update(Integer id, DocumentsHotelDTO update) {
    validateDTOCommon(update);

    var documentsHotel = getById(id);
    mapper.toUpdate(documentsHotel, update);

    if (update.getDocumentUrl() != null && !update.getDocumentUrl().isEmpty()) {
      String filePath = storageFileService.uploadDocument(update.getDocumentUrl());
      documentsHotel.setDocumentUrl(filePath);
    }

    documentsHotel.setUpdatedAt(LocalDateTime.now());
    documentsHotel.setUpdatedBy(authService.getAuthLogin());

    return repository.save(documentsHotel);
  }

  @Override
  protected void validateDTOCommon(DocumentsHotelDTO documentsHotelDTO) {
    if (!hotelRepository.existsByIdAndDeletedAtIsNull(documentsHotelDTO.getHotelId()))
      throw new AppException(ErrorCode.HOTEL_NOTFOUND);

    if (!documentTypeRepository.existsByIdAndDeletedAtIsNull(documentsHotelDTO.getTypeId()))
      throw new AppException(ErrorCode.DOCUMENTS_TYPE_NOTFOUND);
  }

  @Override
  protected void validateCreate(DocumentsHotelDTO create) {
  }

  @Override
  protected void validateUpdate(Integer id, DocumentsHotelDTO update) {
  }

  @Override
  protected void validateDelete(Integer integer) {
  }

  @Override
  protected RuntimeException createNotFoundException(Integer integer) {
    return new AppException(ErrorCode.DOCUMENTS_NOTFOUND);
  }
}
