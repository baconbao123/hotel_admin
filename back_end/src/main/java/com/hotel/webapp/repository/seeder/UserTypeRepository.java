package com.hotel.webapp.repository.seeder;

import com.hotel.webapp.base.BaseRepository;
import com.hotel.webapp.entity.UserType;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserTypeRepository extends BaseRepository<UserType, Integer> {
  //  insert
  @Modifying
  @Transactional
  @Query("insert into UserType (name, createdAt, createdBy) values (:name, :createdAt, :createdBy)")
  void insertUserType(String name, LocalDateTime createdAt, Integer createdBy);

  //  find-by-name
  @Query("select t from UserType t where t.name = :name and t.deletedAt is null")
  Optional<UserType> findUserTypeByName(String name);

  @Query("select t from UserType t where t.deletedAt is null")
  List<UserType> findUserTypes();
}
