package com.hotel.webapp.repository;

import com.hotel.webapp.base.BaseRepository;
import com.hotel.webapp.entity.MapResourcesAction;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
public interface MapResourceActionRepository extends BaseRepository<MapResourcesAction, Integer> {
  //  -------------- seeder --------------
  @Query("SELECT r.id FROM Resources r WHERE r.name = :name")
  Optional<Integer> findResourceIdByName(String name);

  @Modifying
  @Transactional
  @Query("insert into Resources (name, createdAt, createdBy) values (:name, :createdAt, :createdBy)")
  void insertResources(String name, LocalDateTime createdAt, int createdBy);

  @Query("SELECT a.id FROM Actions a WHERE a.name = :name")
  Optional<Integer> findActionIdByName(String name);

  @Modifying
  @Transactional
  @Query("insert into Actions (name, createdAt, createdBy) values (:name, :createdAt, :createdBy)")
  void insetActions(String name, LocalDateTime createdAt, int createdBy);

  @Query("select mr.id from MapResourcesAction mr where mr.resourceId = :resourceId and mr.actionId = :actionId")
  Optional<Integer> findIdByResourceIdAndActionId(int resourceId, int actionId);

  @Modifying
  @Transactional
  @Query(value = "insert into MapResourcesAction (resourceId, actionId, createdAt, createdBy)" +
        "values (:resourceId, :actionId, :createdAt, :createdBy)")
  void insertMapping(int resourceId, int actionId, Timestamp createdAt, int createdBy);

  //  -------------- seeder --------------

  List<MapResourcesAction> findAllByActionId(int actionId);

  List<MapResourcesAction> findAllByResourceId(int resourceId);

  boolean existsByIdAndDeletedAtIsNull(int id);

  List<MapResourcesAction> findAllByResourceIdInAndDeletedAtIsNull(Collection<Integer> resourceIds);


  @Query("select count(a) > 0 from Actions a where a.id = :id and a.deletedAt is null")
  boolean existedAction(Integer id);

  @Query("select count(r) > 0 from Resources r where r.id = :id and r.deletedAt is null")
  boolean existedResource(Integer id);

  @Query("SELECT mra.id, r.id, r.name, a.id, a.name " +
        "FROM MapResourcesAction mra " +
        "JOIN Resources r ON mra.resourceId = r.id " +
        "JOIN Actions a ON mra.actionId = a.id")
  List<Object[]> findMapResourcesActions();

//  @Query("select new com.hotel.webapp.dto.response.DataResponse(r.id, r.name) from Resources r where r.deletedAt is null")
//  List<DataResponse> findAllResources();
}