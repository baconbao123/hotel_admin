package com.hotel.webapp.repository;

import com.hotel.webapp.base.BaseRepository;
import com.hotel.webapp.entity.Address;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AddressRepository extends BaseRepository<Address, Integer> {
  boolean existsByIdAndDeletedAtIsNull(Integer id);

  Optional<Address> findByIdAndDeletedAtIsNull(Integer id);
}
