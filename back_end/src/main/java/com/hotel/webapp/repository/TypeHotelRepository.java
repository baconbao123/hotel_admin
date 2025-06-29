package com.hotel.webapp.repository;

import com.hotel.webapp.entity.TypeHotel;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface TypeHotelRepository extends JpaRepository<TypeHotel, Integer> {
  // seeder - type hotel
  //  insert
  @Modifying
  @Transactional
  @Query("insert into TypeHotel(name, colName, createdAt, createdBy) values (:name, :colName, :createdAt, :createdBy)")
  void insertTypeHotel(String name, String colName, LocalDateTime createdAt, Integer createdBy);

  //  find-by-name
  @Query("select t from TypeHotel t where t.name = :name and t.deletedAt is null")
  Optional<TypeHotel> findHTypeHotelByName(String name);
}
