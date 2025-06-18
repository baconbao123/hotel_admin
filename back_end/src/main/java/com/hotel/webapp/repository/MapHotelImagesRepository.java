//package com.hotel.webapp.repository;
//
//import com.hotel.webapp.entity.MapHotelImages;
//import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.stereotype.Repository;
//
//import java.util.List;
//
//@Repository
//public interface MapHotelImagesRepository extends JpaRepository<MapHotelImages, Integer> {
//  List<MapHotelImages> findByHotelIdAndDeletedAtIsNull(int hotelId);
//
//  boolean existsByHotelIdAndDeletedAtIsNull(Integer integer);
//}
