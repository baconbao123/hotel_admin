package com.hotel.webapp.dto.request.owner;

import com.hotel.webapp.validation.FieldNotEmpty;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BookingDTO {
  @FieldNotEmpty(field = "Customer")
  Integer userId;
  @FieldNotEmpty(field = "Room")
  Integer roomId;
  @FieldNotEmpty(field = "Check In Time")
  LocalDateTime checkInTime;
  @FieldNotEmpty(field = "Check Out Time")
  LocalDateTime checkOutTime;
  String note;
  @FieldNotEmpty(field = "Status")
  Boolean status;

//  LocalDateTime actualCheckInTime;
//  LocalDateTime actualCheckOutTime;

  //  payment
  //  Integer bookingId;
  @FieldNotEmpty(field = "Method")
  Integer methodId;
  @FieldNotEmpty(field = "Amount")
  BigDecimal amount;
  String notePayment;
  @FieldNotEmpty(field = "Status")
  Boolean statusPayment;

  @Getter
  @Setter
  @FieldDefaults(level = AccessLevel.PRIVATE)
  public static class UserBookingDTO {
    @FieldNotEmpty(field = "Customer")
    Integer userId;
    @FieldNotEmpty(field = "Room")
    Integer roomId;
    @FieldNotEmpty(field = "Check In Time")
    LocalDateTime checkInTime;
    @FieldNotEmpty(field = "Check Out Time")
    LocalDateTime checkOutTime;
    String note;

    //  payment
    @FieldNotEmpty(field = "Method")
    Integer methodId;
    @FieldNotEmpty(field = "Amount")
    BigDecimal amount;
    String notePayment;
  }

}
