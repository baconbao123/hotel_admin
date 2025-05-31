package com.hotel.webapp.service.admin;

import com.hotel.webapp.base.BaseMapper;
import com.hotel.webapp.base.BaseServiceImpl;
import com.hotel.webapp.dto.request.RoleDTO;
import com.hotel.webapp.entity.MapUserRoles;
import com.hotel.webapp.entity.Permissions;
import com.hotel.webapp.entity.Role;
import com.hotel.webapp.exception.AppException;
import com.hotel.webapp.exception.ErrorCode;
import com.hotel.webapp.repository.MapUserRoleRepository;
import com.hotel.webapp.repository.PermissionsRepository;
import com.hotel.webapp.repository.RoleRepository;
import com.hotel.webapp.service.admin.interfaces.AuthService;
import com.hotel.webapp.util.ValidateDataInput;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RoleServiceImpl extends BaseServiceImpl<Role, Integer, RoleDTO, RoleRepository> {
  ValidateDataInput validateDataInput;
  MapUserRoleRepository mapUserRoleRepository;
  PermissionsRepository permissionsRepository;

  public RoleServiceImpl(
        RoleRepository repository,
        BaseMapper<Role, RoleDTO> mapper,
        AuthService authService,
        ValidateDataInput validateDataInput,
        MapUserRoleRepository mapUserRoleRepository,
        PermissionsRepository permissionsRepository
  ) {
    super(repository, mapper, authService);
    this.validateDataInput = validateDataInput;
    this.mapUserRoleRepository = mapUserRoleRepository;
    this.permissionsRepository = permissionsRepository;
  }

  @Override
  protected void validateCreate(RoleDTO create) {
    if (repository.existsByNameAndDeletedAtIsNull(create.getName()))
      throw new AppException(ErrorCode.FIELD_EXISTED, "Role");

    create.setName(validateDataInput.capitalizeFirstLetter(create.getName()));
  }

  @Override
  protected void validateUpdate(Integer id, RoleDTO update) {
    if (repository.existsByNameAndIdNotAndDeletedAtIsNull(update.getName(), id))
      throw new AppException(ErrorCode.FIELD_EXISTED, "Role");

    update.setName(validateDataInput.capitalizeFirstLetter(update.getName()));
  }

  @Override
  protected RuntimeException createNotFoundException(Integer integer) {
    return new AppException(ErrorCode.NOT_FOUND, "Role");
  }

  @Override
  protected void beforeDelete(Integer id) {
    updateMapURIfRoleDelete(id, getAuthId());
  }

  private void updateMapURIfRoleDelete(int roleId, int authId) {
    List<MapUserRoles> mapUserRolesList = mapUserRoleRepository.findAllByRoleId(roleId);

    List<Integer> mapURIds = mapUserRolesList.stream()
                                             .map(MapUserRoles::getId)
                                             .toList();

    updatePermissionIfUserDelete(mapURIds, authId);

    for (MapUserRoles mapUserRoles : mapUserRolesList) {
      mapUserRoles.setDeletedAt(LocalDateTime.now());
      mapUserRoles.setUpdatedBy(authId);
      mapUserRoleRepository.save(mapUserRoles);
    }
  }

  private void updatePermissionIfUserDelete(Collection<Integer> mapUserRoleId, int authId) {
    List<Permissions> findAllPermissions = permissionsRepository.findAllByMapURId(mapUserRoleId);

    for (Permissions permission : findAllPermissions) {
      permission.setDeletedAt(LocalDateTime.now());
      permission.setUpdatedBy(authId);
      permissionsRepository.save(permission);
    }
  }
}
