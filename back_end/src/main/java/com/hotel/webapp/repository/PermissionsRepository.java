package com.hotel.webapp.repository;

import com.hotel.webapp.base.BaseRepository;
import com.hotel.webapp.entity.Permissions;
import com.hotel.webapp.entity.Resources;
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

  List<Permissions> findAllByRoleId(@Param("roleId") Integer roleId);

  @Query("SELECT DISTINCT r.id, r.name " +
        "FROM Role r " +
        "WHERE r.deletedAt IS NULL " +
        "AND (:roleName IS NULL OR :roleName = '' OR r.name LIKE CONCAT('%', :roleName, '%')) " +
        "ORDER BY r.id DESC")
  Page<Object[]> getPaginatedRoles(@Param("roleName") String roleName, Pageable pageable);

  @Query("SELECT p.mapResourcesActionId AS map_rs_action_id, r.id AS role_id, r.name AS role_name, " +
        "COALESCE(mra.resourceId, NULL) AS resource_id, COALESCE(re.name, NULL) AS resource_name, " +
        "COALESCE(mra.actionId, NULL) AS action_id, COALESCE(ac.name, NULL) AS action_name " +
        "FROM Role r " +
        "LEFT JOIN Permissions p ON p.roleId = r.id AND p.deletedAt IS NULL " +
        "LEFT JOIN MapResourcesAction mra ON p.mapResourcesActionId = mra.id " +
        "LEFT JOIN Resources re ON mra.resourceId = re.id " +
        "LEFT JOIN Actions ac ON mra.actionId = ac.id " +
        "WHERE r.deletedAt IS NULL AND r.id IN :roleIds " +
        "ORDER BY r.id DESC")
  List<Object[]> getPermissionsForRoles(@Param("roleIds") List<Integer> roleIds);

  @Query("SELECT COUNT(DISTINCT r.id) " +
        "FROM Role r " +
        "WHERE r.deletedAt IS NULL " +
        "AND (:roleName IS NULL OR :roleName = '' OR r.name LIKE CONCAT('%', :roleName, '%'))")
  long countDistinctRoles(@Param("roleName") String roleName);

  @Query("SELECT u1.fullName, p.createdAt, u2.fullName, p.updatedAt, " +
        "mra.id AS mapRsActionId, re.id AS resourceId, re.name AS resourceName, " +
        "a.id AS actionId, a.name AS actionName, r.id AS roleId, r.name AS roleName " +
        "FROM Permissions p " +
        "LEFT JOIN User u1 on p.createdBy = u1.id " +
        "LEFT JOIN User u2 on p.updatedBy = u2.id " +
        "LEFT JOIN MapResourcesAction mra ON mra.id = p.mapResourcesActionId " +
        "LEFT JOIN Resources re ON mra.resourceId = re.id " +
        "LEFT JOIN Actions a ON mra.actionId = a.id " +
        "LEFT JOIN Role r ON p.roleId = r.id " +
        "WHERE p.roleId = :roleId AND p.deletedAt IS NULL")
  List<Object[]> getPermissionsByRoleId(@Param("roleId") Integer roleId);

  // check permission
  @Query("select count(p) > 0 from Permissions p " +
        "join Role r on p.roleId = r.id " +
        "join MapResourcesAction mra on p.mapResourcesActionId = mra.id and mra.deletedAt is null " +
        "join MapUserRoles mur on r.id = mur.roleId and mur.deletedAt is null " +
        "join User u on mur.userId = u.id " +
        "join Resources res on mra.resourceId = res.id " +
        "join Actions a on mra.actionId = a.id " +
        "where u.id = :userId and res.name = :resource and a.name = :action and p.deletedAt is null")
  boolean checkPermission(
        @Param("userId") Integer userId,
        @Param("resource") String resource,
        @Param("action") String action);

  @Query("select re.name, a.name from Resources re " +
        "join MapUserRoles mur on mur.userId = :userId and mur.deletedAt is null " +
        "join Role r on mur.roleId = r.id " +
        "join MapResourcesAction mra on mra.resourceId = re.id and mra.deletedAt is null " +
        "join Actions a on mra.actionId = a.id and a.deletedAt is null " +
        "join Permissions p on p.mapResourcesActionId = mra.id and p.roleId = r.id and p.deletedAt is null ")
  List<Object[]> getResourceByUserId(Integer userId);

  @Query("select re.name, a.name from Resources re " +
        "join MapResourcesAction mra on mra.resourceId = re.id and mra.deletedAt is null " +
        "join Actions a on a.id = mra.actionId")
  List<Object[]> getResources();


//  @Query("select re from Resources re " +
//        "join MapUserRoles mur on mur.userId = :userId and mur.deletedAt is null " +
//        "join Role r on mur.roleId = r.id " +
//        "join MapResourcesAction mra on mra.resourceId = re.id and mra.deletedAt is null " +
//        "join Permissions p on p.mapResourcesActionId = mra.id and p.roleId = r.id and p.deletedAt is null ")
//  List<Resources> getResourceByUserId(Integer userId);
//
//  @Query("select re from Resources re")
//  List<Resources> getResources();

  List<Permissions> findPermissionsByRoleId(Integer roleId);
}
