package com.hotel.webapp.repository;

import com.hotel.webapp.base.BaseRepository;
import com.hotel.webapp.entity.Streets;
import org.springframework.stereotype.Repository;


@Repository
public interface StreetRepository extends BaseRepository<Streets, Integer> {
  boolean existsByNameAndDeletedAtIsNull(String name);

  boolean existsByNameAndIdNotAndDeletedAtIsNull(String name, Integer id);

}
