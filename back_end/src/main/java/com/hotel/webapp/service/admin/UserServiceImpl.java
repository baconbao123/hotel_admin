package com.hotel.webapp.service.admin;

import com.hotel.webapp.base.BaseMapper;
import com.hotel.webapp.base.BaseServiceImpl;
import com.hotel.webapp.dto.admin.request.UserDTO;
import com.hotel.webapp.entity.MapUserRoles;
import com.hotel.webapp.entity.Permissions;
import com.hotel.webapp.entity.User;
import com.hotel.webapp.exception.AppException;
import com.hotel.webapp.exception.ErrorCode;
import com.hotel.webapp.repository.AddressRepository;
import com.hotel.webapp.repository.MapUserRoleRepository;
import com.hotel.webapp.repository.PermissionsRepository;
import com.hotel.webapp.repository.UserRepository;
import com.hotel.webapp.service.admin.interfaces.AuthService;
import com.hotel.webapp.service.system.StorageFileService;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserServiceImpl extends BaseServiceImpl<User, Integer, UserDTO, UserRepository> {
  MapUserRoleRepository mapUserRoleRepository;
  StorageFileService storageFileService;
  PasswordEncoder passwordEncoder;
  PermissionsRepository permissionsRepository;
  AddressRepository addressRepository;

  public UserServiceImpl(
        UserRepository repository,
        BaseMapper<User, UserDTO> mapper,
        AuthService authService,
        MapUserRoleRepository mapUserRoleRepository,
        StorageFileService storageFileService,
        PasswordEncoder passwordEncoder,
        PermissionsRepository permissionsRepository,
        AddressRepository addressRepository
  ) {
    super(repository, mapper, authService);
    this.mapUserRoleRepository = mapUserRoleRepository;
    this.storageFileService = storageFileService;
    this.passwordEncoder = passwordEncoder;
    this.permissionsRepository = permissionsRepository;
    this.addressRepository = addressRepository;
  }

  @Override
  public User create(UserDTO createDto) {
    if (repository.existsByEmailAndDeletedAtIsNull(createDto.getEmail()))
      throw new AppException(ErrorCode.EMAIL_EXISTED);

    if (createDto.getAddressId() != null)
      if (!addressRepository.existsById(createDto.getAddressId()))
        throw new AppException(ErrorCode.ADDRESS_NOTFOUND);


    var user = mapper.toCreate(createDto);

    if (createDto.getAvatarUrl() != null && !createDto.getAvatarUrl().isEmpty()) {
      String filePath = storageFileService.uploadUserImg(createDto.getAvatarUrl());
      user.setAvatarUrl(filePath);
    } else {
      user.setAvatarUrl("");
    }
    user.setPassword(passwordEncoder.encode(createDto.getPassword()));
    user.setCreatedAt(new Timestamp(System.currentTimeMillis()));
    user.setCreatedBy(getAuthId());
    return repository.save(user);
  }

  @Override
  public User update(Integer id, UserDTO updateDto) {
    var user = getById(id);

    if (repository.existsByEmailAndIdNotAndDeletedAtIsNull(updateDto.getEmail(), id))
      throw new AppException(ErrorCode.EMAIL_EXISTED);

    mapper.toUpdate(user, updateDto);

    if (updateDto.getPassword() != null && !updateDto.getPassword().isEmpty()) {
      user.setPassword(passwordEncoder.encode(updateDto.getPassword()));
    } else {
      user.setPassword(user.getPassword());
    }

    if (updateDto.getAvatarUrl() != null && !updateDto.getAvatarUrl().isEmpty()) {
      String fileName = storageFileService.uploadUserImg(updateDto.getAvatarUrl());
      user.setAvatarUrl(fileName);
    }
    user.setIsActive(updateDto.getIsActive());
    user.setUpdatedAt(new Timestamp(System.currentTimeMillis()));
    user.setUpdatedBy(getAuthId());

    return repository.save(user);
  }

  @Override
  public List<User> getAll() {
    return repository.findAllExcludeSa();
  }

  @Override
  protected void validateCreate(UserDTO create) {
  }

  @Override
  protected void validateUpdate(Integer id, UserDTO update) {
  }

  @Override
  protected void validateDelete(Integer id) {
    User user = getById(id);
    if (user.getEmail().equalsIgnoreCase("sa@gmail.com")) {
      throw new AppException(ErrorCode.DONT_DELETE_SA);
    }

    updateMapURIfUserDelete(id, getAuthId());
  }

  @Override
  protected RuntimeException createNotFoundException(Integer integer) {
    return new AppException(ErrorCode.USER_NOTFOUND);
  }


  private void updateMapURIfUserDelete(int userId, int authId) {
    List<MapUserRoles> mapUserRolesList = mapUserRoleRepository.findAllByUserId(userId);

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
