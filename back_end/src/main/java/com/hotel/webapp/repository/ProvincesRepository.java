package com.hotel.webapp.repository;

import com.hotel.webapp.dto.response.LocalResponse;
import com.hotel.webapp.entity.Provinces;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProvincesRepository extends JpaRepository<Provinces, String> {
  @Query("select new com.hotel.webapp.dto.response.LocalResponse(p.code, p.name) from Provinces p ")
  List<LocalResponse> findProvinces();

  boolean existsByCode(String code);
}
