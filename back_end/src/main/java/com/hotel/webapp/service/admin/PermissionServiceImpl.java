package com.hotel.webapp.service.admin;

import com.hotel.webapp.base.BaseServiceImpl;
import com.hotel.webapp.dto.request.MappingDTO;
import com.hotel.webapp.dto.response.PermissionRes;
import com.hotel.webapp.entity.Permissions;
import com.hotel.webapp.exception.AppException;
import com.hotel.webapp.exception.ErrorCode;
import com.hotel.webapp.repository.MapResourceActionRepository;
import com.hotel.webapp.repository.MapUserRoleRepository;
import com.hotel.webapp.repository.PermissionsRepository;
import com.hotel.webapp.service.admin.interfaces.AuthService;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Slf4j
@Service
@Transactional
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PermissionServiceImpl extends BaseServiceImpl<Permissions, Integer, MappingDTO, PermissionsRepository> {
  MapResourceActionRepository mapResourceActionRepository;
  MapUserRoleRepository mapUserRoleRepository;

  public PermissionServiceImpl(
        AuthService authService,
        PermissionsRepository repository,
        MapResourceActionRepository mapResourceActionRepository,
        MapUserRoleRepository mapUserRoleRepository
  ) {
    super(repository, authService);
    this.mapResourceActionRepository = mapResourceActionRepository;
    this.mapUserRoleRepository = mapUserRoleRepository;
  }

  public List<Permissions> updatePermission(MappingDTO updateDto) {
    List<Permissions> existingPermissions = repository.findAllByRoleId(updateDto.getRoleId());

    // Prepare new/updated permissions
    List<Permissions> permissionsToSave = new ArrayList<>();
    Set<Integer> newResourceActionIds = new HashSet<>(updateDto.getMapResourceActionIds());

    for (Permissions existed : existingPermissions) {
      existed.setDeletedAt(LocalDateTime.now());
      existed.setUpdatedBy(getAuthId());
      repository.save(existed);
    }

    for (Integer newMapId : newResourceActionIds) {
      Permissions newPermission = new Permissions();
      newPermission.setRoleId(updateDto.getRoleId());
      newPermission.setMapResourcesActionId(newMapId);
      newPermission.setCreatedAt(LocalDateTime.now());
      newPermission.setCreatedBy(getAuthId());
      permissionsToSave.add(newPermission);
      repository.save(newPermission);
    }

    return permissionsToSave;
  }

  public boolean checkPermission(Integer userId, String resource, String action) {
    return repository.checkPermission(userId, resource, action);
  }

//  public List<PermissionRes> getAllPermissions() {
//    List<Object[]> results = repository.getAllPermissions();
//    Map<String, PermissionRes> permissionMap = new HashMap<>();
//
//    for (Object[] result : results) {
//      Integer permissionId = (Integer) result[0];
//      Integer mapRsActionId = (Integer) result[1];
//      Integer roleId = (Integer) result[2];
//      String roleName = (String) result[3];
//      Integer resourceId = (Integer) result[4];
//      String resourceName = (String) result[5];
//      Integer actionId = (Integer) result[6];
//      String actionName = (String) result[7];
//
//      if (roleId == null || roleName == null) {
//        continue;
//      }
//
//      String key = permissionId != null ? "perm_" + permissionId : "role_" + roleId;
//      PermissionRes permissionRes = permissionMap.computeIfAbsent(key, k ->
//            new PermissionRes(permissionId, new ArrayList<>()));
//
//      PermissionRes.RoleRes roleRes = permissionRes.getRoleRes().stream()
//                                                   .filter(res -> res.getRoleId().equals(roleId))
//                                                   .findFirst()
//                                                   .orElseGet(() -> {
//                                                     PermissionRes.RoleRes newRes = new PermissionRes.RoleRes(
//                                                           roleId, roleName, new ArrayList<>());
//                                                     permissionRes.getRoleRes().add(newRes);
//                                                     return newRes;
//                                                   });
//
//      if (resourceId != null && resourceName != null && actionId != null && actionName != null) {
//        boolean resourceExists = roleRes.getPermissions().stream()
//                                        .anyMatch(res -> res.getResourceId().equals(resourceId) && res.getActionId()
//                                                                                                      .equals(
//                                                                                                            actionId));
//
//        if (!resourceExists) {
//          PermissionRes.DataResponse resourceRes = new PermissionRes.DataResponse(
//                mapRsActionId, resourceId, resourceName, actionId, actionName);
//          roleRes.getPermissions().add(resourceRes);
//        }
//      }
//    }
//
//    return new ArrayList<>(permissionMap.values());
//  }

  public Page<PermissionRes> getAllPermissions(int page, int size, Map<String, String> sort) {
    Pageable pageable = buildPageable(page, size, sort);
    Page<Object[]> results = repository.getAllPermissions(pageable);
    Map<String, PermissionRes> permissionMap = new HashMap<>();

    for (Object[] result : results.getContent()) {
      Integer permissionId = (Integer) result[0];
      Integer mapRsActionId = (Integer) result[1];
      Integer roleId = (Integer) result[2];
      String roleNameResult = (String) result[3];
      Integer resourceId = (Integer) result[4];
      String resourceName = (String) result[5];
      Integer actionId = (Integer) result[6];
      String actionName = (String) result[7];

      if (roleId == null || roleNameResult == null) {
        continue;
      }

      String key = permissionId != null ? "perm_" + permissionId : "role_" + roleId;
      PermissionRes permissionRes = permissionMap.computeIfAbsent(key, k ->
            new PermissionRes(permissionId, new ArrayList<>()));

      PermissionRes.RoleRes roleRes = permissionRes.getRoleRes().stream()
                                                   .filter(res -> res.getRoleId().equals(roleId))
                                                   .findFirst()
                                                   .orElseGet(() -> {
                                                     PermissionRes.RoleRes newRes = new PermissionRes.RoleRes(
                                                           roleId, roleNameResult, new ArrayList<>());
                                                     permissionRes.getRoleRes().add(newRes);
                                                     return newRes;
                                                   });

      if (resourceId != null && resourceName != null && actionId != null && actionName != null) {
        boolean resourceExists = roleRes.getPermissions().stream()
                                        .anyMatch(res -> res.getResourceId().equals(resourceId) &&
                                              res.getActionId().equals(actionId));

        if (!resourceExists) {
          PermissionRes.DataResponse resourceRes = new PermissionRes.DataResponse(
                mapRsActionId, resourceId, resourceName, actionId, actionName);
          roleRes.getPermissions().add(resourceRes);
        }
      }
    }

    List<PermissionRes> permissionList = new ArrayList<>(permissionMap.values());
    return new PageImpl<>(permissionList, pageable, results.getTotalElements());
  }

  private Pageable buildPageable(int page, int size, Map<String, String> sort) {
    List<Sort.Order> orders = new ArrayList<>();
    if (sort == null || sort.isEmpty()) {
      orders.add(new Sort.Order(Sort.Direction.ASC, "role_id"));
    } else {
      sort.forEach((field, direction) -> {
        if (field.startsWith("sort[")) {
          String cleanField = field.replaceAll("sort\\[(.*?)\\]", "$1");
          Sort.Direction sortDirection = direction.equalsIgnoreCase("desc")
                ? Sort.Direction.DESC : Sort.Direction.ASC;
          orders.add(new Sort.Order(sortDirection, cleanField));
        }
      });
    }

    return orders.isEmpty()
          ? PageRequest.of(page, size)
          : PageRequest.of(page, size, Sort.by(orders));
  }


  public PermissionRes getPermissionsByRoleId(Integer roleId) {
    if (roleId == null) {
      return null;
    }

    List<Object[]> results = repository.getPermissionsByRoleId(roleId);
    if (results == null || results.isEmpty()) {
      return new PermissionRes(null, new ArrayList<>());
    }

    Map<String, PermissionRes> permissionMap = new HashMap<>();
    String key = "role_" + roleId;
    PermissionRes permissionRes = permissionMap.computeIfAbsent(key, k ->
          new PermissionRes(null, new ArrayList<>()));

    Map<Integer, PermissionRes.RoleRes> roleResMap = new HashMap<>();

    for (Object[] result : results) {
      Integer permissionId = (Integer) result[0];
      Integer mapRsActionId = (Integer) result[1];
      Integer resourceId = (Integer) result[2];
      String resourceName = (String) result[3];
      Integer actionId = (Integer) result[4];
      String actionName = (String) result[5];
      Integer currentRoleId = (Integer) result[6];
      String roleName = (String) result[7];

      if (resourceId != null && resourceName != null && actionId != null && actionName != null) {
        PermissionRes.RoleRes roleRes = roleResMap.computeIfAbsent(currentRoleId != null ? currentRoleId : 0, k -> {
          PermissionRes.RoleRes newRes = new PermissionRes.RoleRes(currentRoleId, roleName, new ArrayList<>());
          permissionRes.getRoleRes().add(newRes);
          return newRes;
        });

        if (mapRsActionId != null) {
          boolean resourceExists = roleRes.getPermissions().stream()
                                          .anyMatch(res -> res.getResourceId().equals(resourceId) && res.getActionId()
                                                                                                        .equals(
                                                                                                              actionId));

          if (!resourceExists) {
            PermissionRes.DataResponse resourceRes = new PermissionRes.DataResponse(
                  mapRsActionId, resourceId, resourceName, actionId, actionName);
            roleRes.getPermissions().add(resourceRes);
          }
        }
      }
    }

    return permissionMap.get(key);
  }

  public List<PermissionRes.DataResponse> getMapResourcesActions() {
    List<Object[]> results = mapResourceActionRepository.findMapResourcesActions();
    return results.stream()
                  .map(result -> new PermissionRes.DataResponse(
                        (Integer) result[0], // mra.id -> id
                        (Integer) result[1], // r.id -> resourceId
                        (String) result[2],  // r.name -> resourceName
                        (Integer) result[3], // a.id -> actionId
                        (String) result[4]   // a.name -> actionName
                  ))
                  .toList();
  }

  @Override
  protected RuntimeException createNotFoundException(Integer integer) {
    return new AppException(ErrorCode.NOT_FOUND, "Permission");
  }
}
