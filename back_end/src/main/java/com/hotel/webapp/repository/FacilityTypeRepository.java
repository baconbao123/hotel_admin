package com.hotel.webapp.repository;

import com.hotel.webapp.base.BaseRepository;
import com.hotel.webapp.entity.FacilityType;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface FacilityTypeRepository extends BaseRepository<FacilityType, Integer> {
  boolean existsByIdAndDeletedAtIsNull(Integer id);

  boolean existsByColNameAndDeletedAtIsNull(String colName);

  // seeder
  Optional<FacilityType> findByNameAndDeletedAtIsNull(String name);

  @Modifying
  @Transactional
  @Query("insert into FacilityType(name, colName, createdAt, createdBy) values (:name, :colName, :createdAt, :createdBy)")
  void insertType(String name, String colName, LocalDateTime createdAt, Integer createdBy);
}
