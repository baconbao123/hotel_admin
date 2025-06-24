package com.hotel.webapp.repository;

import com.hotel.webapp.base.BaseRepository;
import com.hotel.webapp.entity.Facilities;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FacilitiesRepository extends BaseRepository<Facilities, Integer> {
  List<Facilities> findByIdAndDeletedAtIsNull(Integer id);

  @Query("select f.id, f.name, f.icon, f.type, ft.name, f.createdAt, f.updatedAt, u1.fullName, u2.fullName " +
        "from Facilities f " +
        "left join FacilityType ft on ft.id = f.type " +
        "left join User u1 on f.createdBy = u1.id " +
        "left join User u2 on f.updatedBy = u2.id " +
        "where f.id = :id and f.deletedAt is null")
  List<Object[]> findFacilityResById(Integer id);


}
