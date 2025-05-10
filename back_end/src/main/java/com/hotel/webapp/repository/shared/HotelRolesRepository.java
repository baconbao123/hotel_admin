package com.hotel.webapp.repository.shared;

import com.hotel.webapp.entity.shared.HotelRoles;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface HotelRolesRepository extends JpaRepository<HotelRoles, Integer> {
  Optional<HotelRoles> findByName(String name);
}
