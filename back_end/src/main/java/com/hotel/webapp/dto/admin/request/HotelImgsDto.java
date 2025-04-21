package com.hotel.webapp.dto.admin.request;

import com.hotel.webapp.validation.MaxSizeListImg;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Getter
@Setter
public class HotelImgsDto {
  @MaxSizeListImg(value = 3)
  List<MultipartFile> hotelImgs;
  String type;
}
