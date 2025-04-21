package com.hotel.webapp.repository;

import com.hotel.webapp.base.BaseRepository;
import com.hotel.webapp.entity.DocumentType;
import org.springframework.stereotype.Repository;

@Repository
public interface DocumentTypeRepository extends BaseRepository<DocumentType, Integer> {
  boolean existsByIdAndDeletedAtIsNull(Integer id);

  boolean existsByNameAndDeletedAtIsNull(String name);

  boolean existsByNameAndIdNotAndDeletedAtIsNull(String name, Integer id);
}
