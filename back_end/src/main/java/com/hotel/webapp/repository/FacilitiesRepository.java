package com.hotel.webapp.repository;

import com.hotel.webapp.base.BaseRepository;
import com.hotel.webapp.entity.Facilities;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FacilitiesRepository extends BaseRepository<Facilities, Integer> {
  boolean existsByIdAndDeletedAtIsNull(Integer id);

  List<Facilities> findByIdAndDeletedAtIsNull(Integer id);

  List<Facilities> findByColNameAndDeletedAtIsNull(String colName);
}
