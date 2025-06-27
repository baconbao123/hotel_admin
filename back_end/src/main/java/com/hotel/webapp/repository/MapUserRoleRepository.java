package com.hotel.webapp.repository;

import com.hotel.webapp.base.BaseRepository;
import com.hotel.webapp.entity.MapUserRoles;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
public interface MapUserRoleRepository extends BaseRepository<MapUserRoles, Integer> {
  // start app
  Optional<MapUserRoles> findByRoleIdAndUserId(int roleId, int userId);

  //  find all
  List<MapUserRoles> findAllByUserIdAndDeletedAtIsNull(int userId);

  List<MapUserRoles> findAllByRoleId(int roleId);

  List<MapUserRoles> findAllByUserIdInAndDeletedAtIsNull(Collection<Integer> userId);


  // find role ids
  List<Integer> findRoleIdsByUserIdAndDeletedAtIsNull(Integer userId);

  //  exist
  boolean existsByIdAndDeletedAtIsNull(Integer id);


}
