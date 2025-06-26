package com.hotel.webapp.repository;

import com.hotel.webapp.base.BaseRepository;
import com.hotel.webapp.entity.MapHotelType;
import com.hotel.webapp.entity.TypeHotel;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface TypeHotelRepository extends BaseRepository<TypeHotel, Integer> {
  // seeder
  @Modifying
  @Transactional
  @Query("insert into TypeHotel(name, colName, createdAt, createdBy) values (:name, :colName, :createdAt, :createdBy)")
  void insertTypeHotel(String name, String colName, LocalDateTime createdAt, Integer createdBy);

  Optional<TypeHotel> findByNameAndDeletedAtIsNull(String name);

  // type hotel
  @Query("select t from TypeHotel t where t.deletedAt is null")
  List<TypeHotel> findAllAndDeletedAtIsNull();

}
