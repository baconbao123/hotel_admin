package com.hotel.webapp.repository;

import com.hotel.webapp.base.BaseRepository;
import com.hotel.webapp.entity.Permissions;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PermissionsRepository extends BaseRepository<Permissions, Integer> {
  @Query("select p from Permissions p where p.roleId = :id and p.deletedAt is null order by p.id asc " +
        "FETCH FIRST 1 ROWS ONLY")
  Optional<Permissions> findByRoleId(Integer id);

  List<Permissions> findByMapResourcesActionId(int mapResourcesActionId);

  List<Permissions> findAllByRoleId(@Param("roleId") Integer roleId);

  //  @Query(value = "SELECT p.id AS permission_id, mra.id AS map_rs_action_id, r.id AS role_id, r.name AS role_name, " +
//        "COALESCE(re.id, NULL) AS resource_id, COALESCE(re.name, NULL) AS resource_name, " +
//        "COALESCE(a.id, NULL) AS action_id, COALESCE(a.name, NULL) AS action_name " +
//        "FROM Role r " +
//        "LEFT JOIN Permissions p ON r.id = p.roleId AND p.deletedAt IS NULL " +
//        "LEFT JOIN MapResourcesAction mra ON p.mapResourcesActionId = mra.id " +
//        "LEFT JOIN Resources re ON mra.resourceId = re.id " +
//        "LEFT JOIN Actions a ON mra.actionId = a.id " +
//        "WHERE r.deletedAt IS NULL " +
//        "AND (:roleName IS NULL OR r.name LIKE '%' || :roleName || '%') " +
//        "ORDER BY r.id ASC")
//  Page<Object[]> getAllPermissions(@Param("roleName") String roleName, Pageable pageable);
  @Query(value = "SELECT p.id AS permission_id, mra.id AS map_rs_action_id, r.id AS role_id, r.name AS role_name, " +
        "COALESCE(re.id, NULL) AS resource_id, COALESCE(re.name, NULL) AS resource_name, " +
        "COALESCE(a.id, NULL) AS action_id, COALESCE(a.name, NULL) AS action_name " +
        "FROM Role r " +
        "LEFT JOIN Permissions p ON r.id = p.roleId AND p.deletedAt IS NULL " +
        "LEFT JOIN MapResourcesAction mra ON p.mapResourcesActionId = mra.id " +
        "LEFT JOIN Resources re ON mra.resourceId = re.id " +
        "LEFT JOIN Actions a ON mra.actionId = a.id " +
        "WHERE r.deletedAt IS NULL " +
        "ORDER BY r.id ASC")
  Page<Object[]> getAllPermissions(Pageable pageable);

  @Query("SELECT p.id AS permissionId, mra.id AS mapRsActionId, re.id AS resourceId, re.name AS resourceName, " +
        "a.id AS actionId, a.name AS actionName, r.id AS roleId, r.name AS roleName " +
        "FROM Permissions p " +
        "LEFT JOIN MapResourcesAction mra ON mra.id = p.mapResourcesActionId " +
        "LEFT JOIN Resources re ON mra.resourceId = re.id " +
        "LEFT JOIN Actions a ON mra.actionId = a.id " +
        "LEFT JOIN Role r ON p.roleId = r.id " +
        "WHERE p.roleId = :roleId AND p.deletedAt IS NULL")
  List<Object[]> getPermissionsByRoleId(@Param("roleId") Integer roleId);

  // check permission
  @Query("select count(p) > 0 from Permissions p " +
        "join Role r on p.roleId = r.id " +
        "join MapResourcesAction mra on p.mapResourcesActionId = mra.id " +
        "join MapUserRoles mur on r.id = mur.id " +
        "join User u on mur.userId = u.id " +
        "join Resources res on mra.resourceId = res.id " +
        "join Actions a on mra.actionId = a.id " +
        "where u.id= :userId and res.name = :resource and a.name = :action")
  boolean checkPermission(
        @Param("userId") Integer userId,
        @Param("resource") String resource,
        @Param("action") String action);


}
