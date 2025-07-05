package com.hotel.webapp.repository.seeder;

import com.hotel.webapp.base.BaseRepository;
import com.hotel.webapp.entity.RoomType;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface RoomTypeRepository extends BaseRepository<RoomType, Integer> {
  //  insert
  @Modifying
  @Transactional
  @Query("insert into RoomType (name, createdAt, createdBy) values (:name, :createdAt, :createdBy)")
  void insertRoomType(String name, LocalDateTime createdAt, Integer createdBy);

  //  find-by-name
  @Query("select t from RoomType t where t.name = :name and t.deletedAt is null")
  Optional<RoomType> findRoomTypeByName(String name);
}
