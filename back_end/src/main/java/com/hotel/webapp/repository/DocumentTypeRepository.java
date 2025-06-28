package com.hotel.webapp.repository;

import com.hotel.webapp.base.BaseRepository;
import com.hotel.webapp.entity.DocumentType;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface DocumentTypeRepository extends BaseRepository<DocumentType, Integer> {
  // seeder
  Optional<DocumentType> findByNameAndDeletedAtIsNull(String name);

  @Transactional
  @Modifying
  @Query("insert into DocumentType (name, colName, createdAt, createdBy) " +
        "values (:name, :colName, :createdAt, :createdBy)")
  void insertDocumentType(String name, String colName, LocalDateTime createdAt, Integer createdBy);

  // hotel document
  @Query("select t from DocumentType t where t.deletedAt is null")
  List<DocumentType> findAllAndDeletedAtIsNull();
}
