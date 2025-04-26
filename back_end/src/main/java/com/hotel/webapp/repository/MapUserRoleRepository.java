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
  Optional<MapUserRoles> findByRoleIdAndUserId(int roleId, int userId);

  @Query("select mur.id from MapUserRoles mur where mur.roleId = :roleId and mur.userId = :userId")
  int findIdByRoleIdAndUserId(int roleId, int userId);

  //  find all
  List<MapUserRoles> findAllByUserId(int userId);

  List<MapUserRoles> findAllByRoleId(int roleId);

  List<MapUserRoles> findAllByUserIdInAndDeletedAtIsNull(Collection<Integer> userId);

  List<Integer> findAllByUserIdAndDeletedAtIsNull(int userId);

  // find role ids
  List<Integer> findRoleIdsByUserIdAndDeletedAtIsNull(Integer userId);

  //  exist
  boolean existsByIdAndDeletedAtIsNull(Integer id);


}
