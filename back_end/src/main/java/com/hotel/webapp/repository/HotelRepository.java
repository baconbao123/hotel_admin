package com.hotel.webapp.repository;

import com.hotel.webapp.base.BaseRepository;
import com.hotel.webapp.entity.Hotels;
import org.springframework.stereotype.Repository;

@Repository
public interface HotelRepository extends BaseRepository<Hotels, Integer> {
  boolean existsByIdAndDeletedAtIsNull(Integer id);
}
