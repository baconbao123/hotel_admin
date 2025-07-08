package com.hotel.webapp.controller.user;

import com.hotel.webapp.dto.response.ApiResponse;
import com.hotel.webapp.dto.response.UserRes;
import com.hotel.webapp.service.admin.UserService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/user-profile")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserFeController {
  UserService userService;

  @GetMapping
  public ApiResponse<UserRes.UserFEProfileRes> findProfileLogin() {
    return ApiResponse.<UserRes.UserFEProfileRes>builder()
                      .result(userService.findUserProfile())
                      .build();
  }
}
