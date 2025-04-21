package com.hotel.webapp.repository;

import com.hotel.webapp.base.BaseRepository;
import com.hotel.webapp.entity.MapHotelFacility;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MapHotelFacilityRepository extends BaseRepository<MapHotelFacility, Integer> {
  List<MapHotelFacility> findByHotelIdAndDeletedAtIsNull(Integer hotelId);

  List<MapHotelFacility> findByFacilityIdAndDeletedAtIsNull(Integer facilityId);
}
