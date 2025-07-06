package com.hotel.webapp.controller.user;

import com.hotel.webapp.dto.response.ApiResponse;
import com.hotel.webapp.dto.user_response.HomeRes;
import com.hotel.webapp.dto.user_response.HotelUserRes;
import com.hotel.webapp.service.user.HomeService;
import com.hotel.webapp.service.user.HotelUserService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/user")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class HotelUserFEController {
  HomeService homeService;
  HotelUserService hotelUserService;

  @GetMapping("/home")
  public ApiResponse<HomeRes> getData(@RequestParam int page) {
    return ApiResponse.<HomeRes>builder()
                      .result(homeService.getData(page))
                      .build();
  }

  @GetMapping("/hotel/{id}")
  public ApiResponse<HotelUserRes> getData(@PathVariable Integer id) {
    return ApiResponse.<HotelUserRes>builder()
                      .result(hotelUserService.getData(id))
                      .build();
  }
}
