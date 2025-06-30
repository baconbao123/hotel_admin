package com.hotel.webapp.service.admin;

import com.hotel.webapp.base.BaseServiceImpl;
import com.hotel.webapp.dto.request.MappingDTO;
import com.hotel.webapp.dto.response.PermissionRes;
import com.hotel.webapp.entity.Permissions;
import com.hotel.webapp.entity.User;
import com.hotel.webapp.exception.AppException;
import com.hotel.webapp.exception.ErrorCode;
import com.hotel.webapp.repository.MapResourceActionRepository;
import com.hotel.webapp.repository.MapUserRoleRepository;
import com.hotel.webapp.repository.PermissionsRepository;
import com.hotel.webapp.repository.UserRepository;
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
public class PermissionService extends BaseServiceImpl<Permissions, Integer, MappingDTO, PermissionsRepository> {
  MapResourceActionRepository mapResourceActionRepository;
  UserRepository userRepository;
  MapUserRoleRepository mapUserRoleRepository;

  public PermissionService(
        AuthService authService,
        PermissionsRepository repository,
        MapResourceActionRepository mapResourceActionRepository,
        MapUserRoleRepository mapUserRoleRepository,
        UserRepository userRepository
  ) {
    super(repository, authService);
    this.mapResourceActionRepository = mapResourceActionRepository;
    this.mapUserRoleRepository = mapUserRoleRepository;
    this.userRepository = userRepository;
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

  public Page<PermissionRes> getAllPermissions(int page, int size, Map<String, String> sort,
        Map<String, String> filters) {
    Pageable pageable = buildPageable(page, size, sort);
    String roleName = filters != null ? filters.get("roleName") : null;

    Page<Object[]> roleResults = repository.getPaginatedRoles(roleName, pageable);
    List<Integer> roleIds = roleResults.getContent().stream()
                                       .map(row -> (Integer) row[0])
                                       .toList();

    List<Object[]> permissionResults = repository.getPermissionsForRoles(roleIds);

    Map<String, PermissionRes> permissionMap = new HashMap<>();
    for (Object[] result : permissionResults) {
      Integer mapRsActionId = (Integer) result[0];
      Integer roleId = (Integer) result[1];
      String roleNameResult = (String) result[2];
      Integer resourceId = (Integer) result[3];
      String resourceName = (String) result[4];
      Integer actionId = (Integer) result[5];
      String actionName = (String) result[6];

      if (roleId == null || roleNameResult == null) {
        continue;
      }

      String key = "role_" + roleId;
      PermissionRes permissionRes = permissionMap.computeIfAbsent(key, k ->
            new PermissionRes(null, null, null, null, new ArrayList<>()));

      PermissionRes.RoleRes roleRes = permissionRes.getRoleRes().stream()
                                                   .filter(res -> res.getRoleId().equals(roleId))
                                                   .findFirst()
                                                   .orElseGet(() -> {
                                                     PermissionRes.RoleRes newRes = new PermissionRes.RoleRes(
                                                           roleId, roleNameResult, new ArrayList<>());
                                                     permissionRes.getRoleRes().add(newRes);
                                                     return newRes;
                                                   });

      if (mapRsActionId != null && resourceId != null &&
            resourceName != null && actionId != null && actionName != null) {
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
    long totalRoles = repository.countDistinctRoles(roleName);
    return new PageImpl<>(permissionList, pageable, totalRoles);
  }

  private Pageable buildPageable(int page, int size, Map<String, String> sort) {
    List<Sort.Order> orders = new ArrayList<>();
    if (sort == null || sort.isEmpty()) {
      orders.add(new Sort.Order(Sort.Direction.DESC, "role_id"));
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
      return new PermissionRes(null, null, null, null, new ArrayList<>());
    }

    Object[] firstResult = results.get(0);
    PermissionRes permissionRes = new PermissionRes(
          (String) firstResult[0],
          (LocalDateTime) firstResult[1],
          (String) firstResult[2],
          (LocalDateTime) firstResult[3],
          new ArrayList<>()
    );

    Map<Integer, PermissionRes.RoleRes> roleResMap = new HashMap<>();

    for (Object[] result : results) {
      Integer mapRsActionId = (Integer) result[4];
      Integer resourceId = (Integer) result[5];
      String resourceName = (String) result[6];
      Integer actionId = (Integer) result[7];
      String actionName = (String) result[8];
      Integer currentRoleId = (Integer) result[9];
      String roleName = (String) result[10];

      if (resourceId != null && resourceName != null && actionId != null && actionName != null) {
        PermissionRes.RoleRes roleRes = roleResMap.computeIfAbsent(
              currentRoleId != null ? currentRoleId : 0, k -> {
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

    return permissionRes;
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

  public List<PermissionRes.ResourceActions> getUserResource() {
    Integer userId = getAuthId();
    User user = userRepository.findById(userId).orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND, "User"));

    List<Object[]> queryResults;

    if (user.getEmail().equals("sa@gmail.com")) {
      queryResults = repository.getResources();
    } else {
      queryResults = repository.getResourceByUserId(userId);
    }

    Map<String, List<String>> resourceActionMap = new HashMap<>();
    for (Object[] result : queryResults) {
      String resourceName = (String) result[0];
      String actionName = (String) result[1];
      resourceActionMap.computeIfAbsent(resourceName, k -> new ArrayList<>()).add(actionName);
    }

    List<PermissionRes.ResourceActions> resourceActions = new ArrayList<>();
    for (Map.Entry<String, List<String>> entry : resourceActionMap.entrySet()) {
      resourceActions.add(new PermissionRes.ResourceActions(entry.getKey(), entry.getValue()));
    }

    return resourceActions;
  }

  //  public List<Resources> getUserResource() {
//    Integer userId = getAuthId();
//    User user = userRepository.findById(userId).orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND, "User"));
//
//    if (user.getEmail().equals("sa@gmail.com")) {
//      return repository.getResources();
//    }
//
//    return repository.getResourceByUserId(userId);
//  }

  @Override
  protected RuntimeException createNotFoundException(Integer integer) {
    return new AppException(ErrorCode.NOT_FOUND, "Permission");
  }
}
