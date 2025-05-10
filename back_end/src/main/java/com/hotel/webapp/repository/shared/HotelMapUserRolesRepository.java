package com.hotel.webapp.repository.shared;

import com.hotel.webapp.entity.shared.HotelMapUserRoles;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HotelMapUserRolesRepository extends JpaRepository<HotelMapUserRoles, Long> {
}
