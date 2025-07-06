package com.hotel.webapp.dto.request;

import com.hotel.webapp.validation.FieldNotEmpty;
import com.hotel.webapp.validation.MultipartFileCheckEmptyAndSize;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RoomDTO {
  @FieldNotEmpty(field = "Name")
  String name;

  String keepAvatar;
  @MultipartFileCheckEmptyAndSize(field = "avatar", value = 1)
  MultipartFile roomAvatar;
  String existingAvatarUrl;

  @FieldNotEmpty(field = "Hotel")
  Integer hotelId;
  @FieldNotEmpty(field = "Room number")
  Integer roomNumber;
  @FieldNotEmpty(field = "Area")
  BigDecimal roomArea;
  @FieldNotEmpty(field = "Room Type")
  Integer roomType;
  @FieldNotEmpty(field = "Price Hours")
  BigDecimal priceHour;
  @FieldNotEmpty(field = "Price Night")
  BigDecimal priceNight;
  @FieldNotEmpty(field = "Limit")
  Integer limitPerson;
  String description;
  @FieldNotEmpty(field = "status")
  Boolean status;

  @FieldNotEmpty(field = "Facilities")
  List<Integer> facilities;

  @MultipartFileCheckEmptyAndSize(field = "images", value = 3, force = false)
  List<HotelDTO.ImagesReq> images;
}
