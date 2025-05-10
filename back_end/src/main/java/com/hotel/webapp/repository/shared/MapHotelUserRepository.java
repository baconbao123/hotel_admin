package com.hotel.webapp.repository.shared;

import com.hotel.webapp.entity.shared.MapHotelUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MapHotelUserRepository extends JpaRepository<MapHotelUser, Integer> {
}
