package com.hotel.webapp.service.admin.interfaces;

import com.hotel.webapp.dto.request.AuthReq;
import com.hotel.webapp.dto.request.IntrospectRequest;
import com.hotel.webapp.dto.request.TokenRefreshReq;
import com.hotel.webapp.dto.response.AuthResponse;
import com.hotel.webapp.dto.response.IntrospectRes;

public interface AuthService {
  AuthResponse authenticate(AuthReq authReq);

  AuthResponse refreshToken(TokenRefreshReq tokenRefreshReq);

  Integer getAuthLogin();

  IntrospectRes introspect(IntrospectRequest request);
}
