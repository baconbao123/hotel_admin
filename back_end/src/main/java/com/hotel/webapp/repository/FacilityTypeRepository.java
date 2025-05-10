package com.hotel.webapp.repository;

import com.hotel.webapp.base.BaseRepository;
import com.hotel.webapp.entity.FacilityType;
import org.springframework.stereotype.Repository;

@Repository
public interface FacilityTypeRepository extends BaseRepository<FacilityType, Integer> {
  boolean existsByNameAndDeletedAtIsNull(String name);

  boolean existsByNameAndIdNotAndDeletedAtIsNull(String name, Integer id);

  boolean existsByIdAndDeletedAtIsNull(Integer id);

  boolean existsByColNameAndDeletedAtIsNull(String colName);

  String findColNameById(Integer id);
}
