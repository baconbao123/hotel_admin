package com.hotel.webapp.service.admin;

import com.hotel.webapp.base.BaseMapper;
import com.hotel.webapp.base.BaseServiceImpl;
import com.hotel.webapp.dto.request.NameDTO;
import com.hotel.webapp.entity.Actions;
import com.hotel.webapp.entity.MapResourcesAction;
import com.hotel.webapp.entity.Permissions;
import com.hotel.webapp.exception.AppException;
import com.hotel.webapp.exception.ErrorCode;
import com.hotel.webapp.repository.ActionRepository;
import com.hotel.webapp.repository.MapResourceActionRepository;
import com.hotel.webapp.repository.PermissionsRepository;
import com.hotel.webapp.service.admin.interfaces.AuthService;
import com.hotel.webapp.util.ValidateDataInput;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

@Service
@Transactional
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ActionServiceImpl extends BaseServiceImpl<Actions, Integer, NameDTO, ActionRepository> {
  ValidateDataInput validateDataInput;
  MapResourceActionRepository actionResourceRepository;
  PermissionsRepository permissionsRepository;

  public ActionServiceImpl(
        ActionRepository actionRepository,
        BaseMapper<Actions, NameDTO> mapper,
        AuthService authService,
        ValidateDataInput validateDataInput,
        MapResourceActionRepository actionResourceRepository,
        PermissionsRepository permissionsRepository
  ) {
    super(actionRepository, mapper, authService);
    this.validateDataInput = validateDataInput;
    this.actionResourceRepository = actionResourceRepository;
    this.permissionsRepository = permissionsRepository;
  }

  @Override
  protected void validateCreate(NameDTO create) {
    if (repository.existsByNameAndDeletedAtIsNull(create.getName())) {
      throw new AppException(ErrorCode.FIELD_EXISTED, "Action");
    }
    create.setName(validateDataInput.lowercaseStr(create.getName()));
  }

  @Override
  protected void validateUpdate(Integer id, NameDTO update) {
    if (repository.existsByNameAndIdNotAndDeletedAtIsNull(update.getName(), id)) {
      throw new AppException(ErrorCode.FIELD_EXISTED, "Action");
    }
    update.setName(validateDataInput.lowercaseStr(update.getName()));
  }

  @Override
  protected void beforeDelete(Integer id) {
    updateMapRAIfActionDelete(id, getAuthId());
  }

  @Override
  protected RuntimeException createNotFoundException(Integer integer) {
    return new AppException(ErrorCode.NOT_FOUND, "Action");
  }


  private void updateMapRAIfActionDelete(int actionId, int authId) {
    List<MapResourcesAction> mapRAList = actionResourceRepository.findAllByActionId(actionId);

    List<Integer> mapRAIds = mapRAList.stream()
                                      .map(MapResourcesAction::getId)
                                      .toList();

    updatePermissionIfActionDelete(mapRAIds, authId);

    for (MapResourcesAction mapRA : mapRAList) {
      mapRA.setDeletedAt(LocalDateTime.now());
      mapRA.setUpdatedBy(authId);
      actionResourceRepository.save(mapRA);
    }
  }

  private void updatePermissionIfActionDelete(Collection<Integer> mapRAs, int authId) {
    List<Permissions> findAllPermissions = permissionsRepository.findAllByMapRAId(mapRAs);

    for (Permissions permission : findAllPermissions) {
      permission.setDeletedAt(LocalDateTime.now());
      permission.setUpdatedBy(authId);
      permissionsRepository.save(permission);
    }
  }
}