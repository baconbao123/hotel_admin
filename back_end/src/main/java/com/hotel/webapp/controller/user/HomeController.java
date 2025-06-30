package com.hotel.webapp.controller.user;

import com.hotel.webapp.dto.response.ApiResponse;
import com.hotel.webapp.dto.user_response.HomeRes;
import com.hotel.webapp.service.user.HomeService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/user")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class HomeController {
  HomeService homeService;

  @GetMapping("/home")
  public ApiResponse<HomeRes> getData(@RequestParam int page) {
    return ApiResponse.<HomeRes>builder()
                      .result(homeService.getData(page))
                      .build();
  }
}
