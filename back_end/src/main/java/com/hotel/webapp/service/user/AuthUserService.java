package com.hotel.webapp.service.user;

import com.hotel.webapp.dto.request.AuthReq;
import com.hotel.webapp.dto.response.AuthResponse;
import com.hotel.webapp.dto.user_response.UserAuth;
import com.hotel.webapp.entity.User;
import com.hotel.webapp.exception.AppException;
import com.hotel.webapp.exception.ErrorCode;
import com.hotel.webapp.repository.UserRepository;
import com.hotel.webapp.service.admin.UserService;
import com.hotel.webapp.service.system.StorageFileService;
import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jwt.JWTClaimsSet;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthUserService {
  UserService userService;
  UserRepository userRepository;
  PasswordEncoder passwordEncoder;
  StorageFileService storageFileService;


  @NonFinal
  @Value("${jwt.signerKey}")
  protected String SIGNER_KEY;

  @NonFinal
  @Value("${jwt.valid-duration}")
  protected int VALIDATION_DURATION;

  @NonFinal
  @Value("${jwt.refreshable-duration}")
  protected int REFRESHABLE_DURATION;

  public AuthResponse authenticate(UserAuth authReq) {
    var user = userRepository.findByEmail(authReq.getEmail())
                             .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND, "User"));
    boolean authenticated = passwordEncoder.matches(authReq.getPassword(), user.getPassword());

    if (!authenticated) {
      throw new AppException(ErrorCode.AUTHENTICATION_FAILED);
    }

    var token = generateToken(user);

    String refreshToken = authReq.getRemember() ? UUID.randomUUID().toString() : "";

    if (refreshToken != null && !refreshToken.isEmpty()) {
      user.setRefreshToken(refreshToken);
      user.setExpired(LocalDateTime.now().plusSeconds(REFRESHABLE_DURATION));
    }

    userRepository.save(user);

    return AuthResponse.builder().token(token).refreshToken(refreshToken).build();
  }

  private String generateToken(User user) {
    JWSHeader header = new JWSHeader(JWSAlgorithm.HS512);

    JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
          .subject(user.getEmail())
          .issuer("Phoebe dev")
          .issueTime(new Date())
          .expirationTime(new Date(Instant.now().plus(VALIDATION_DURATION, ChronoUnit.SECONDS).toEpochMilli()))
          .claim("userId", user.getId())
          .build();

    Payload payload = new Payload(jwtClaimsSet.toJSONObject());

    JWSObject jwsObject = new JWSObject(header, payload);

    try {
      jwsObject.sign(new MACSigner(SIGNER_KEY.getBytes()));
      return jwsObject.serialize();
    } catch (JOSEException e) {
      throw new RuntimeException(e);
    }
  }

  //  @Override
  public Integer getAuthUserLogin() {
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    var username = auth.getName();
    User user = userRepository.findByEmail(username)
                              .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND, "Auth login"));
    return user.getId();
  }

  public AuthResponse refreshToken(AuthReq.TokenRefreshReq tokenRefreshReq) {
    var refreshToken = tokenRefreshReq.getRefreshToken();

    var user = userRepository.findByRefreshToken(refreshToken)
                             .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND, "User"));

    if (user.getExpired() != null && user.getExpired().isBefore(LocalDateTime.now())) {
      throw new AppException(ErrorCode.EXPIRED_TOKEN);
    }

    String newToken = generateToken(user);
    String newRefreshToken = UUID.randomUUID().toString();

    user.setRefreshToken(newRefreshToken);
    user.setExpired(LocalDateTime.now().plusSeconds(REFRESHABLE_DURATION));
    userRepository.save(user);
    return AuthResponse.builder().token(newToken).refreshToken(newRefreshToken).build();
  }

  public Boolean register(UserAuth.UserRegister register) {
    if (userRepository.existsByEmail(register.getEmail())) {
      throw new AppException(ErrorCode.FIELD_EXISTED, "Email");
    }

    String avatarStr = null;
    if (register.getAvatar() != null && !register.getAvatar().isEmpty()) {
      avatarStr = storageFileService.uploadUserImg(register.getAvatar());
    }


    var user = User.builder()
                   .fullName(register.getFullName())
                   .email(register.getEmail())
                   .password(passwordEncoder.encode(register.getPassword()))
                   .userType(3)
                   .avatarUrl(avatarStr)
                   .status(true)
                   .phoneNumber(register.getPhoneNumber())
                   .build();

    User savedUser = userRepository.save(user);

    return savedUser != null;
  }


//  @Override
//  public AuthResponse.IntrospectRes introspect(AuthReq.IntrospectRequest request) {
//    var token = request.getToken();
//    boolean isValid = true;
//
//    try {
//      verifyToken(token);
//    } catch (ParseException | JOSEException e) {
//      isValid = false;
//    }
//
//    return AuthResponse.IntrospectRes.builder().isValid(isValid).build();
//  }

//  public SignedJWT verifyToken(String token) throws JOSEException, ParseException {
//    JWSVerifier verifier = new MACVerifier(SIGNER_KEY.getBytes());
//
//    SignedJWT signedJWT = SignedJWT.parse(token);
//
//    Date expTime = signedJWT.getJWTClaimsSet().getExpirationTime();
//
//    boolean verified = signedJWT.verify(verifier);
//
//    if (expTime == null || !verified || expTime.before(new Date())) {
//      throw new AppException(ErrorCode.UNAUTHENTICATED);
//    }
//
//    return signedJWT;
//  }

//  public String generatePasswordResetToken(String email) {
//    JWSHeader header = new JWSHeader(JWSAlgorithm.HS512);
//
//    JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
//          .subject(email)
//          .issuer("Phoebe dev")
//          .issueTime(new Date())
//          .expirationTime(new Date(Instant.now().plus(30, ChronoUnit.MINUTES).toEpochMilli()))
//          .build();
//
//    Payload payload = new Payload(jwtClaimsSet.toJSONObject());
//
//    JWSObject jwsObject = new JWSObject(header, payload);
//
//    try {
//      jwsObject.sign(new MACSigner(SIGNER_KEY.getBytes()));
//      return jwsObject.serialize();
//    } catch (JOSEException e) {
////      log.error("Cannot create token");
//      throw new RuntimeException(e);
//    }
//  }
//
//  public void resetPassword(String token, String newPassword) throws ParseException, JOSEException {
//    SignedJWT verify = verifyToken(token);
//
//    String email = verify.getJWTClaimsSet().getSubject();
//
//    User user = userRepository.findByEmail(email)
//                              .orElseThrow(() -> new RuntimeException("User not found"));
//
//    user.setPassword(passwordEncoder.encode(newPassword));
//    userRepository.save(user);
//  }
}
