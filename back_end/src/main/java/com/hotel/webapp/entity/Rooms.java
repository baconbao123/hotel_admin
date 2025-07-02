package com.hotel.webapp.entity;

import com.hotel.webapp.base.AuditEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Rooms implements AuditEntity {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  Integer id;
  @Column(nullable = false)
  String name;
  String roomAvatar;
  @Column(nullable = false)
  Integer hotelId;
  @Column(nullable = false)
  Integer roomNumber;
  @Column(nullable = false)
  BigDecimal roomArea;
  Integer roomType;
  @Column(nullable = false)
  BigDecimal priceHour;
  @Column(nullable = false)
  BigDecimal priceNight;
  @Column(nullable = false)
  Integer limitPerson;
  @Lob
  String description;
  @Column(nullable = false)
  Boolean status;
  LocalDateTime createdAt;
  LocalDateTime updatedAt;
  Integer createdBy;
  Integer updatedBy;
  LocalDateTime deletedAt;
}
