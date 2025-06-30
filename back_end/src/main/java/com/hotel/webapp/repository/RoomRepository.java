package com.hotel.webapp.repository;

import com.hotel.webapp.base.BaseRepository;
import com.hotel.webapp.entity.Rooms;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface RoomRepository extends BaseRepository<Rooms, Integer> {
  // user
  @Query("select min(r.priceNight) from Rooms r " +
        "where r.hotelId = :hotelId and r.deletedAt is null")
  BigDecimal findPriceNightByHotelId(int hotelId);

  @Query("select min(r.priceNight), max(r.priceNight) " +
        "from Rooms r " +
        "where r.deletedAt is null")
  List<Object[]> findMinMaxPrice();

}
