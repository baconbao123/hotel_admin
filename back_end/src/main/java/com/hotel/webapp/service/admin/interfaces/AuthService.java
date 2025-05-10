package com.hotel.webapp.service.admin.interfaces;

import com.hotel.webapp.dto.admin.request.AuthReq;
import com.hotel.webapp.dto.admin.request.IntrospectRequest;
import com.hotel.webapp.dto.admin.request.TokenRefreshReq;
import com.hotel.webapp.dto.admin.response.AuthResponse;
import com.hotel.webapp.dto.admin.response.IntrospectRes;

public interface AuthService {
  AuthResponse authenticate(AuthReq authReq);

  AuthResponse refreshToken(TokenRefreshReq tokenRefreshReq);

  Integer getAuthLogin();

  IntrospectRes introspect(IntrospectRequest request);
}
