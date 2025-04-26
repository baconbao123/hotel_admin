package com.hotel.webapp.base;
import java.sql.Timestamp;
import java.time.LocalDateTime;

public interface AuditEntity {
  void setCreatedAt(LocalDateTime createdAt);
  void setCreatedBy(Integer createdBy);
  void setUpdatedAt(LocalDateTime updatedAt);
  void setUpdatedBy(Integer updatedBy);
  void setDeletedAt(LocalDateTime deletedAt);
  LocalDateTime getDeletedAt();
}
