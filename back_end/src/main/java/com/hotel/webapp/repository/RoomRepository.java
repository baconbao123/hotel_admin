package com.hotel.webapp.repository;

import com.hotel.webapp.base.BaseRepository;
import com.hotel.webapp.dto.response.owner.RoomRes;
import com.hotel.webapp.entity.Rooms;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface RoomRepository extends BaseRepository<Rooms, Integer> {
  // rooms
  @Query("select r from Rooms r where r.hotelId = :hotelId and r.deletedAt is null")
  Page<Rooms> findByHotelId(Integer hotelId, Specification<Rooms> spec, Pageable pageable);

  @Query("select r from Rooms r " +
        "join Hotels h on r.hotelId = h.id " +
        "join User u on u.id = h.ownerId " +
        "where u.id = :userId and r.deletedAt is null ")
  Page<Rooms> findHotelOwnerByHotelId(Integer userId, Specification<Rooms> spec, Pageable pageable);

  // user
  @Query("SELECT COALESCE(MIN(r.priceNight), null) FROM Rooms r WHERE r.hotelId = :hotelId AND r.deletedAt IS NULL")
  BigDecimal findPriceNightByHotelId(int hotelId);

  @Query("select min(r.priceNight), max(r.priceNight) " +
        "from Rooms r " +
        "where r.deletedAt is null")
  List<Object[]> findMinMaxPrice();


  @Query("select new com.hotel.webapp.dto.response.owner.RoomRes(r.id, r.name, r.roomAvatar, h.name, r.roomArea, " +
        "r.roomNumber, rt.name, r.priceHour, r.priceNight, r.limitPerson, r.description, r.status, u1.fullName, " +
        "u2.fullName, r.createdAt, r.updatedAt, null )" +
        "from Rooms r " +
        "join Hotels h on h.id = r.hotelId " +
        "join RoomType rt on rt.id = r.roomType " +
        "left join User u1 on r.createdBy = u1.id " +
        "left join User u2 on r.updatedBy = u2.id " +
        "where r.id = :id and r.deletedAt is null ")
  RoomRes findRoomById(Integer id);

  @Query("select f.id, f.name  from MapRoomFacility mrf " +
        "join Rooms r on mrf.roomId = r.id " +
        "join Facilities f on f.id = mrf.facilityId " +
        "where r.id = :roomId and mrf.deletedAt is null and r.deletedAt is null and f.deletedAt is null ")
  List<Object[]> findFacilitiesByRoomId(Integer roomId);

  // user
  @Query("select r.id, r.name, h.addressId, r.description, r.roomArea, r.priceHour, r.priceNight, rt.name, " +
        "r.roomAvatar, r.limitPerson, h.id, hp.id, hp.name, hp.description " +
        "from Rooms r " +
        "join Hotels h on h.id = r.hotelId " +
        "join RoomType rt on rt.id = r.roomType " +
        "join HotelPolicy hp on h.id = hp.hotelId " +
        "left join User u1 on r.createdBy = u1.id " +
        "left join User u2 on r.updatedBy = u2.id " +
        "where r.id = :id and r.deletedAt is null ")
  List<Object[]> findRoomDetail(Integer id);

  @Query("select r.id, r.name, r.roomAvatar, r.description, r.roomArea, r.priceHour, r.priceNight, rt.name, " +
        "r.limitPerson, r.roomNumber, r.hotelId " +
        "from Rooms r " +
        "join RoomType rt on rt.id = r.roomType " +
        "where r.hotelId = :hotelId and r.deletedAt is null")
  List<Object[]> findRoomsByHotelId(Integer hotelId);

//  List<Rooms> findByHotelIdAndRoomType(Integer hotelId, Integer roomType);


}
