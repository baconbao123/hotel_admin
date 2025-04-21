package com.hotel.webapp.repository;

import com.hotel.webapp.entity.MapHotelType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MapHotelTypeRepository extends JpaRepository<MapHotelType, Integer> {
  boolean existsByHotelIdAndDeletedAtIsNull(int hotelId);

  List<MapHotelType> findByHotelIdAndDeletedAtIsNull(int hotelId);
}
