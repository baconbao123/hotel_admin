package com.hotel.webapp.repository;

import com.hotel.webapp.base.BaseRepository;
import com.hotel.webapp.entity.MapHotelType;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MapHotelTypeRepository extends BaseRepository<MapHotelType, Integer> {
  boolean existsByHotelIdAndDeletedAtIsNull(int hotelId);

  List<MapHotelType> findByHotelIdAndDeletedAtIsNull(int hotelId);

  List<MapHotelType> findByColNameAndDeletedAtIsNull(String colName);
}
