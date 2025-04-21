package com.hotel.webapp.repository;

import com.hotel.webapp.base.BaseRepository;
import com.hotel.webapp.entity.TypeHotel;
import org.springframework.stereotype.Repository;

@Repository
public interface TypeHotelRepository extends BaseRepository<TypeHotel, Integer> {
  boolean existsByNameAndDeletedAtIsNull(String name);

  boolean existsByNameAndIdNotAndDeletedAtIsNull(String name, Integer id);

  boolean existsByIdAndDeletedAtIsNull(Integer id);
}
