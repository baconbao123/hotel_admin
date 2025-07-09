package com.hotel.webapp.repository;

import com.hotel.webapp.base.BaseRepository;
import com.hotel.webapp.dto.response.owner.BookingRes;
import com.hotel.webapp.dto.response.owner.PricesDTO;
import com.hotel.webapp.entity.Booking;
import com.hotel.webapp.entity.Rooms;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BookingRepository extends BaseRepository<Booking, Integer> {
  @Query("select new com.hotel.webapp.dto.response.owner.BookingRes(b.id, u.id, u.fullName, r.id, r.roomNumber, " +
        "b.checkInTime, b.checkOutTime, b.actualCheckInTime, b.actualCheckOutTime,b.note, b.status," +
        "null, null, null, null, null, " +
        "null, null, null, null) " +
        "from Booking b " +
        "join User u on b.userId = u.id " +
        "join Rooms r on b.roomId = r.id " +
        "where r.id = :roomId and b.deletedAt is null")
  Page<BookingRes> findBookingsByRoomId(Integer roomId, Specification<Rooms> spec, Pageable pageable);

  // find by id
  @Query("select new com.hotel.webapp.dto.response.owner.BookingRes(b.id, u.id, u.fullName, r.id, r.roomNumber, " +
        "b.checkInTime, b.checkOutTime, b.actualCheckInTime, b.actualCheckOutTime, b.note, b.status, " +
        "pay.id, method.name, pay.amount, pay.note, pay.status, " +
        "u1.fullName, u2.fullName, b.createdAt, b.updatedAt) " +
        "from Booking b " +
        "join User u on b.userId = u.id " +
        "join Rooms r on b.roomId = r.id " +
        "join Payment pay on pay.id = b.paymentId " +
        "join PaymentMethod method on pay.methodId =  method.id " +
        "left join User u1 on b.createdBy = u1.id " +
        "left join User u2 on b.updatedBy = u2.id " +
        "where b.id = :id and b.deletedAt is null")
  BookingRes findBookingById(Integer id);

  @Query("select new com.hotel.webapp.dto.response.owner.PricesDTO(r.priceHour, r.priceNight) from Rooms r " +
        "where r.id = :roomId and r.deletedAt is null")
  PricesDTO getPriceDataByRoomId(Integer roomId);


  // booking
  @Query("SELECT b FROM Booking b WHERE b.roomId = :roomId " +
        "AND b.checkInTime >= :start AND b.checkInTime <= :end " +
        "AND b.deletedAt IS NULL")
  List<Booking> findBookingsByRoomIdAndDateRange(
        @Param("roomId") Integer roomId,
        @Param("start") LocalDateTime start,
        @Param("end") LocalDateTime end
  );

  // user
  List<Booking> findAllByUserIdAndDeletedAtIsNull(Integer userId);
}
