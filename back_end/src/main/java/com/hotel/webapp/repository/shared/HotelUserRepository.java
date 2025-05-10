package com.hotel.webapp.repository.shared;

import com.hotel.webapp.entity.shared.HotelUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HotelUserRepository extends JpaRepository<HotelUser, Integer> {
}
