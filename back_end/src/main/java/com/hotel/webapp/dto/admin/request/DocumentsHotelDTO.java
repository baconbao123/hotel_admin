package com.hotel.webapp.dto.admin.request;

import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
public class DocumentsHotelDTO {
  String name;
  Integer hotelId;
  Integer typeId;
  MultipartFile documentUrl;
}
