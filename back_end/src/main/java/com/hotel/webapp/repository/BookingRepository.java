package com.hotel.webapp.repository;

import com.hotel.webapp.base.BaseRepository;
import com.hotel.webapp.dto.response.BookingRes;
import com.hotel.webapp.entity.Booking;
import com.hotel.webapp.entity.Rooms;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface BookingRepository extends BaseRepository<Booking, Integer> {
  @Query("select new com.hotel.webapp.dto.response.BookingRes(b.id, u.id, u.fullName, r.id, r.roomNumber, " +
        "b.checkInTime, b.checkOutTime, b.actualCheckInTime, b.actualCheckOutTime, b.status) " +
        "from Booking b " +
        "join User u on b.userId = u.id " +
        "join Rooms r on b.roomId = r.id " +
        "where r.id = :roomId and b.deletedAt is null")
  Page<BookingRes> findBookingsByRoomId(Integer roomId, Specification<Rooms> spec, Pageable pageable);

}
