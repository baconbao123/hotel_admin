package com.hotel.webapp.service.admin.interfaces;

import com.hotel.webapp.dto.request.AuthReq;
import com.hotel.webapp.dto.request.IntrospectRequest;
import com.hotel.webapp.dto.request.TokenRefreshReq;
import com.hotel.webapp.dto.response.AuthResponse;
import com.hotel.webapp.dto.response.IntrospectRes;
import com.nimbusds.jose.JOSEException;

import java.text.ParseException;

public interface AuthService {
  AuthResponse authenticate(AuthReq authReq);

  AuthResponse refreshToken(TokenRefreshReq tokenRefreshReq);

  Integer getAuthLogin();

  IntrospectRes introspect(IntrospectRequest request);

  String generatePasswordResetToken(String email);

  void resetPassword(String token, String newPassword) throws ParseException, JOSEException;
}
