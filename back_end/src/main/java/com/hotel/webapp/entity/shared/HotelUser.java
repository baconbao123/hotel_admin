package com.hotel.webapp.entity.shared;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "hotel_users")
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class HotelUser {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  Integer id;
  String fullName;
  String email;
  String phoneNumber;
  @Lob
  String password;
  String avatarUrl;
  Integer addressId;
  @Lob
  String refreshToken;
  Boolean isActive;
  Instant createdAt;
  Instant updatedAt;
  Integer createdBy;
  Integer updatedBy;
  Instant deletedAt;

}