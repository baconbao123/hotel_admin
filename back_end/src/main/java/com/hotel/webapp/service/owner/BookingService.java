package com.hotel.webapp.service.owner;

import com.hotel.webapp.base.BaseMapper;
import com.hotel.webapp.base.BaseServiceImpl;
import com.hotel.webapp.dto.request.owner.BookingDTO;
import com.hotel.webapp.dto.response.owner.BookingRes;
import com.hotel.webapp.dto.response.owner.PricesDTO;
import com.hotel.webapp.dto.user_response.BookingUserRes;
import com.hotel.webapp.entity.Booking;
import com.hotel.webapp.entity.Payment;
import com.hotel.webapp.entity.Rooms;
import com.hotel.webapp.exception.AppException;
import com.hotel.webapp.exception.ErrorCode;
import com.hotel.webapp.repository.BookingRepository;
import com.hotel.webapp.repository.PaymentRepository;
import com.hotel.webapp.repository.RoomRepository;
import com.hotel.webapp.service.admin.interfaces.AuthService;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class BookingService extends BaseServiceImpl<Booking, Integer, BookingDTO, BookingRepository> {
  PaymentRepository paymentRepository;
  RoomRepository roomRepository;

  public BookingService(
        BookingRepository repository,
        BaseMapper<Booking, BookingDTO> mapper,
        AuthService authService,
        PaymentRepository paymentRepository,
        RoomRepository roomRepository
  ) {
    super(repository, mapper, authService);
    this.paymentRepository = paymentRepository;
    this.roomRepository = roomRepository;
  }

  public Page<BookingRes> findBookingsByRoomId(Integer roomId, Map<String, String> filters, Map<String, String> sort,
        int size, int page) {
    Map<String, Object> filterMap = removedFiltersKey(filters);
    Map<String, Object> sortMap = removedSortedKey(sort);

    Specification<Rooms> spec = buildSpecification(filterMap);
    Pageable defaultPage = buildPageable(sortMap, page, size);

    return repository.findBookingsByRoomId(roomId, spec, defaultPage);
  }

  @Override
  public Booking create(BookingDTO create) {
    if (hasTimeConflict(create.getRoomId(), create.getCheckInTime(), create.getCheckOutTime(), null)) {
      throw new AppException(ErrorCode.COMMON_400, "Selected time slot is already booked");
    }

    // Booking
    var newBooking = mapper.toCreate(create);
    newBooking.setCreatedAt(LocalDateTime.now());
    newBooking.setCreatedBy(getAuthId());
    newBooking = repository.save(newBooking);

    // Payment
    Payment payment = Payment.builder()
                             .methodId(create.getMethodId())
                             .amount(create.getAmount())
                             .note(create.getNotePayment())
                             .status(create.getStatus())
                             .createdAt(LocalDateTime.now())
                             .createdBy(getAuthId())
                             .build();
    payment = paymentRepository.save(payment);

    newBooking.setPaymentId(payment.getId());
    newBooking = repository.save(newBooking);

    return newBooking;
  }

  public Booking userCreate(BookingDTO.UserBookingDTO create) {
    if (hasTimeConflict(create.getRoomId(), create.getCheckInTime(), create.getCheckOutTime(), null)) {
      throw new AppException(ErrorCode.COMMON_400, "Selected time slot is already booked");
    }

    // Booking
    Booking newBooking = new Booking();
    newBooking.setUserId(create.getUserId());
    newBooking.setRoomId(create.getRoomId());
    newBooking.setCheckInTime(create.getCheckInTime());
    newBooking.setCheckOutTime(create.getCheckOutTime());
    newBooking.setCreatedAt(LocalDateTime.now());
    newBooking.setCreatedBy(getAuthId());
    newBooking.setStatus(true);
    newBooking = repository.save(newBooking);

    // Payment
    Payment payment = Payment.builder()
                             .methodId(create.getMethodId())
                             .amount(create.getAmount())
                             .note(create.getNotePayment())
                             .status(true)
                             .createdAt(LocalDateTime.now())
                             .createdBy(getAuthId())
                             .build();
    payment = paymentRepository.save(payment);

    newBooking.setPaymentId(payment.getId());
    newBooking = repository.save(newBooking);

    return newBooking;
  }


  @Override
  public Booking update(Integer id, BookingDTO update) {
    // Booking
    Booking booking = repository.findById(id)
                                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND, "Booking"));

    if (hasTimeConflict(update.getRoomId(), update.getCheckInTime(), update.getCheckOutTime(), id)) {
      throw new AppException(ErrorCode.COMMON_400, "Selected time slot is already booked");
    }

    // Update booking fields
    booking.setUserId(update.getUserId());
    booking.setRoomId(update.getRoomId());
    booking.setCheckInTime(update.getCheckInTime());
    booking.setCheckOutTime(update.getCheckOutTime());
    booking.setUpdatedAt(LocalDateTime.now());
    booking.setUpdatedBy(getAuthId());
    booking = repository.save(booking);

    // Find and update payment
    Payment payment = paymentRepository.findPaymentByBookingId(booking.getId())
                                       .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND, "Payment"));
    payment.setMethodId(update.getMethodId());
    payment.setAmount(update.getAmount());
    payment.setNote(update.getNotePayment());
    payment.setStatus(update.getStatus());
    payment.setUpdatedAt(LocalDateTime.now());
    payment.setUpdatedBy(getAuthId());
    paymentRepository.save(payment);

    return booking;
  }

  public Booking userUpdate(Integer id, BookingDTO.UserBookingDTO update) {
    // Booking
    Booking booking = repository.findById(id)
                                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND, "Booking"));

    if (hasTimeConflict(update.getRoomId(), update.getCheckInTime(), update.getCheckOutTime(), id)) {
      throw new AppException(ErrorCode.COMMON_400, "Selected time slot is already booked");
    }

    // Update booking
    booking.setUserId(update.getUserId());
    booking.setRoomId(update.getRoomId());
    booking.setCheckInTime(update.getCheckInTime());
    booking.setCheckOutTime(update.getCheckOutTime());
    booking.setUpdatedAt(LocalDateTime.now());
    booking.setUpdatedBy(getAuthId());
    booking = repository.save(booking);

    // Find and update payment
    Payment payment = paymentRepository.findPaymentByBookingId(booking.getId())
                                       .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND, "Payment"));
    payment.setMethodId(update.getMethodId());
    payment.setAmount(update.getAmount());
    payment.setNote(update.getNotePayment());
    payment.setStatus(true);
    payment.setUpdatedAt(LocalDateTime.now());
    payment.setUpdatedBy(getAuthId());
    paymentRepository.save(payment);

    return booking;
  }

  // find by id
  public BookingRes findBookingById(Integer id) {
    var res = repository.findBookingById(id);
    if (res == null) {
      throw new AppException(ErrorCode.NOT_FOUND, "Booking or Payment");
    }
    return res;
  }

  public PricesDTO getPriceData(Integer roomId) {
    return repository.getPriceDataByRoomId(roomId);
  }

  public List<Map<String, LocalDateTime>> getBookedHours(Integer roomId, LocalDate date) {
    if (roomId == null || date == null) {
      throw new AppException(ErrorCode.NOT_FOUND, "Room or Date");
    }
    LocalDateTime startOfDay = date.atStartOfDay();
    LocalDateTime endOfDay = date.atTime(LocalTime.MAX);

    List<Booking> bookings = repository.findBookingsByRoomIdAndDateRange(roomId, startOfDay, endOfDay);
    return bookings.stream()
                   .map(booking -> Map.of(
                         "checkInTime", booking.getCheckInTime(),
                         "checkOutTime", booking.getCheckOutTime()
                   ))
                   .toList();
  }

  private boolean hasTimeConflict(Integer roomId, LocalDateTime checkIn, LocalDateTime checkOut,
        Integer excludeBookingId) {
    if (roomId == null || checkIn == null || checkOut == null) {
      throw new IllegalArgumentException("Room ID, check-in, and check-out times cannot be null");
    }

    List<Booking> bookings = repository.findBookingsByRoomIdAndDateRange(roomId, checkIn, checkOut);

    return bookings.stream()
                   .filter(b -> excludeBookingId == null || !b.getId().equals(excludeBookingId))
                   .anyMatch(b -> {
                     if (checkOut.isEqual(b.getCheckInTime()) && checkIn.isBefore(checkOut)) {
                       return false;
                     }
                     return !(b.getCheckOutTime().isBefore(checkIn) || b.getCheckInTime().isAfter(checkOut));
                   });
  }

  public BookingUserRes bookingUserRes(Integer roomId, LocalDate selectedDate) {
    if (roomId == null || selectedDate == null) {
      throw new IllegalArgumentException("Room ID and selected date cannot be null");
    }

    var room = roomRepository.findRoomById(roomId);

    List<Map<String, LocalDateTime>> bookedTimesMap = getBookedHours(roomId, selectedDate);

    List<BookingUserRes.BookedTime> bookedTimes = bookedTimesMap.stream()
                                                                .map(map -> new BookingUserRes.BookedTime(
                                                                      map.get("checkInTime"),
                                                                      map.get("checkOutTime")
                                                                ))
                                                                .toList();

    // Trả về response
    return new BookingUserRes(
          new BookingUserRes.RoomInfo(
                room.getId(),
                room.getName(),
                room.getPriceHours(),
                room.getPriceNight()
          ),
          bookedTimes
    );
  }

  protected RuntimeException createNotFoundException(Integer roomId) {
    return new AppException(ErrorCode.NOT_FOUND, "Room with ID " + roomId + " not found");
  }

  public List<Booking> findAllBookingByUserId(Integer userId) {
    return repository.findAllByUserIdAndDeletedAtIsNull(userId);
  }

}