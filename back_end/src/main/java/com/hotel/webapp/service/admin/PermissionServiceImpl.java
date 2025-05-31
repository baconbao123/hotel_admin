package com.hotel.webapp.service.admin;

import com.hotel.webapp.base.BaseServiceImpl;
import com.hotel.webapp.dto.request.PermissionDTO;
import com.hotel.webapp.dto.request.properties.PermissionProperties;
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
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Transactional
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PermissionServiceImpl extends BaseServiceImpl<Permissions, Integer, PermissionDTO, PermissionsRepository> {
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


  @Override
  public List<Permissions> createCollectionBulk(PermissionDTO createDto) {
    Set<Integer> mapURs = createDto.getProperties()
                                   .stream()
                                   .map(PermissionProperties::getMapUserRolesId)
                                   .collect(Collectors.toSet());

    // Valid map resource action
    Set<Integer> mapRAIds = createDto.getProperties()
                                     .stream()
                                     .flatMap(prop -> prop.getMapResourcesActionId().stream())
                                     .collect(Collectors.toSet());

    commonValidation(mapURs, mapRAIds);

    List<Permissions> listPermissions = new ArrayList<>();
    for (PermissionProperties properties : createDto.getProperties()) {
      for (Integer mapResourcesActionId : properties.getMapResourcesActionId()) {
        var permission = new Permissions();
        permission.setMapResourcesActionId(mapResourcesActionId);
        permission.setMapUserRolesId(properties.getMapUserRolesId());
        permission.setCreatedAt(LocalDateTime.now());
        permission.setCreatedBy(getAuthId());
        listPermissions.add(permission);
      }
    }

    List<Permissions> savedPermissions = repository.saveAll(listPermissions);
    if (savedPermissions.isEmpty())
      throw new AppException(ErrorCode.CREATION_FAILED);

    return savedPermissions;
  }

  @Override
  public List<Permissions> updateCollectionBulk(Integer id, PermissionDTO updateDto) {
    getById(id);
    // Valid map user role
    Set<Integer> mapURs = updateDto.getProperties()
                                   .stream()
                                   .map(PermissionProperties::getMapUserRolesId)
                                   .collect(Collectors.toSet());

    // Valid map resource action
    Set<Integer> mapRAIds = updateDto.getProperties()
                                     .stream()
                                     .flatMap(prop -> prop.getMapResourcesActionId().stream())
                                     .collect(Collectors.toSet());

    commonValidation(mapURs, mapRAIds);

    //    Delete At old permission
    List<Permissions> oldMappings = repository.findAllByMapURId(mapURs);

    for (Permissions permissions : oldMappings) {
      permissions.setDeletedAt(LocalDateTime.now());
      repository.save(permissions);
    }

    //    Create new permission
    List<Permissions> newPermissions = new ArrayList<>();
    for (PermissionProperties prop : updateDto.getProperties()) {
      for (Integer mapResourcesActionId : prop.getMapResourcesActionId()) {
        Permissions permission = Permissions.builder()
                                            .mapResourcesActionId(mapResourcesActionId)
                                            .mapUserRolesId(prop.getMapUserRolesId())
                                            .updatedAt(LocalDateTime.now())
                                            .updatedBy(getAuthId())
                                            .build();
        newPermissions.add(permission);
      }
    }

    List<Permissions> savedMappings = repository.saveAll(newPermissions);
    if (savedMappings.isEmpty()) {
      throw new AppException(ErrorCode.CREATION_FAILED);
    }

    return savedMappings;
  }

  private void commonValidation(Set<Integer> mapURs, Set<Integer> mapRAIds) {
    for (Integer mapURIds : mapURs) {
      if (!mapUserRoleRepository.existsByIdAndDeletedAtIsNull(mapURIds))
        throw new AppException(ErrorCode.NOT_ACTIVE, "Mapping User Role");
    }


    for (Integer mapRAId : mapRAIds) {
      if (!mapResourceActionRepository.existsByIdAndDeletedAtIsNull(mapRAId))
        throw new AppException(ErrorCode.NOT_ACTIVE, "Mapping Resource Action");
    }
  }

  public boolean checkPermission(Integer userId, String resource, String action) {
    return repository.checkPermission(userId, resource, action);
  }

  @Override
  protected RuntimeException createNotFoundException(Integer integer) {
    return new AppException(ErrorCode.NOT_FOUND, "Permission");
  }
}
