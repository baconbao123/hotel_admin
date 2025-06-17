package com.hotel.webapp.repository;

import com.hotel.webapp.base.BaseRepository;
import com.hotel.webapp.entity.DocumentsHotel;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DocumentsHotelRepository extends BaseRepository<DocumentsHotel, Integer> {
  List<DocumentsHotel> findByColNameAndDeletedAtIsNull(String colName);
}
