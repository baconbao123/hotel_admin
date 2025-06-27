package com.hotel.webapp.service.admin;

import com.hotel.webapp.base.BaseServiceImpl;
import com.hotel.webapp.dto.request.UserDTO;
import com.hotel.webapp.dto.response.UserRes;
import com.hotel.webapp.entity.MapUserRoles;
import com.hotel.webapp.entity.User;
import com.hotel.webapp.exception.AppException;
import com.hotel.webapp.exception.ErrorCode;
import com.hotel.webapp.repository.MapUserRoleRepository;
import com.hotel.webapp.repository.UserRepository;
import com.hotel.webapp.service.admin.interfaces.AuthService;
import com.hotel.webapp.service.system.StorageFileService;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Slf4j
@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserServiceImpl extends BaseServiceImpl<User, Integer, UserDTO, UserRepository> {
  MapUserRoleRepository mapUserRoleRepository;
  StorageFileService storageFileService;
  PasswordEncoder passwordEncoder;

  public UserServiceImpl(
        UserRepository repository,
        AuthService authService,
        MapUserRoleRepository mapUserRoleRepository,
        StorageFileService storageFileService,
        PasswordEncoder passwordEncoder
  ) {
    super(repository, null, authService);
    this.mapUserRoleRepository = mapUserRoleRepository;
    this.storageFileService = storageFileService;
    this.passwordEncoder = passwordEncoder;
  }

  @Override
  public User create(UserDTO create) {
    // valid
    if (create.getPassword() == null) {
      throw new AppException(ErrorCode.COMMON_400, "Password is required");
    }
    if (repository.existsByEmail(create.getEmail()))
      throw new AppException(ErrorCode.FIELD_EXISTED, "Email");

    var user = User.builder()
                   .fullName(create.getFullName())
                   .email(create.getEmail())
                   .phoneNumber(create.getPhoneNumber())
                   .createdAt(LocalDateTime.now())
                   .createdBy(authService.getAuthLogin())
                   .status(create.getStatus())
                   .build();

    if (create.getAvatarUrl() != null && !create.getAvatarUrl().isEmpty()) {
      String filePath = storageFileService.uploadUserImg(create.getAvatarUrl());
      user.setAvatarUrl(filePath);
    } else {
      user.setAvatarUrl("");
    }

    user.setPassword(passwordEncoder.encode(create.getPassword()));
    
    repository.save(user);

    if (create.getRolesIds() != null) {
      for (Integer roleId : create.getRolesIds()) {

        MapUserRoles mapUserRoles = MapUserRoles.builder()
                                                .roleId(roleId)
                                                .userId(user.getId())
                                                .createdAt(LocalDateTime.now())
                                                .createdBy(authService.getAuthLogin())
                                                .build();
        mapUserRoleRepository.save(mapUserRoles);
      }
    }

    return user;
  }

  @Override
  public User update(Integer id, UserDTO update) {
    var user = findById(id);

    // valid
    if (repository.existsByEmailAndIdNot(update.getEmail(), id))
      throw new AppException(ErrorCode.FIELD_EXISTED, "Email");

    user = User.builder()
               .id(user.getId())
               .fullName(update.getFullName())
               .email(update.getEmail())
               .avatarUrl(user.getAvatarUrl())
               .phoneNumber(update.getPhoneNumber())
               .createdBy(user.getCreatedBy())
               .createdAt(user.getCreatedAt())
               .updatedBy(authService.getAuthLogin())
               .updatedAt(LocalDateTime.now())
               .status(update.getStatus())
               .build();

    // before update
    if (update.getPassword() != null && !update.getPassword().isEmpty()) {
      user.setPassword(passwordEncoder.encode(update.getPassword()));
    } else {
      user.setPassword(user.getPassword());
    }

    if ("false".equals(update.getKeepAvatar())) {
      if (update.getAvatarUrl() != null && !update.getAvatarUrl().isEmpty()) {
        String fileName = storageFileService.uploadUserImg(update.getAvatarUrl());
        user.setAvatarUrl(fileName);
      }
    } else {
      user.setAvatarUrl(user.getAvatarUrl());
    }



    user = repository.save(user);

    // after update
    if (update.getRolesIds() != null) {
      List<MapUserRoles> roleExisted = mapUserRoleRepository.findAllByUserIdAndDeletedAtIsNull(user.getId());

      for (MapUserRoles existed : roleExisted) {
        existed.setDeletedAt(LocalDateTime.now());
        existed.setUpdatedBy(getAuthId());
        mapUserRoleRepository.save(existed);
      }

      for (Integer roleId : update.getRolesIds()) {
        MapUserRoles mapUserRoles = MapUserRoles.builder()
                                                .roleId(roleId)
                                                .userId(user.getId())
                                                .createdAt(LocalDateTime.now())
                                                .createdBy(authService.getAuthLogin())
                                                .build();
        mapUserRoleRepository.save(mapUserRoles);
      }
    }

    return user;
  }

  @Override
  protected void validateDelete(Integer id) {
    User user = findById(id);
    if (user.getEmail().equalsIgnoreCase("sa@gmail.com")) {
      throw new AppException(ErrorCode.DONT_DELETE_SA);
    }
  }

  public UserRes findUserById(Integer id) {
    List<Object[]> userObjList = repository.getUserById(id);

    for (int i = 0; i < userObjList.size(); i++) {
      Object[] userObj = userObjList.get(i);
      log.error("userObj[{}] contents: {}", i, Arrays.toString(userObj));
    }

    if (userObjList.isEmpty()) throw new AppException(ErrorCode.NOT_FOUND, "User");

    Object[] userObj = userObjList.get(0);

    Integer userId = (Integer) userObj[0];

    List<Object[]> roleObject = repository.getRolesByUserId(userId);

    List<UserRes.RoleRes> roleRes = new ArrayList<>();

    for (int i = 0; i < roleObject.size(); i++) {
      Object[] roleObj = roleObject.get(i);
      log.error("roleObject[{}] contents: {}", i, Arrays.toString(roleObj));
    }

    for (Object[] role : roleObject) {
      Integer roleId = (Integer) role[0];
      String roleName = (String) role[1];
      roleRes.add(new UserRes.RoleRes(roleId, roleName));
    }

    return new UserRes(
          userId,
          (String) userObj[1], // fullName
          (String) userObj[2], // email
          (String) userObj[3], // phoneNumber
          (String) userObj[4], // avatarUrl
          (Boolean) userObj[5], // status
          roleRes,
          (String) userObj[6], // createdName
          (String) userObj[7], // updatedName
          (LocalDateTime) userObj[8], // createdAt
          (LocalDateTime) userObj[9] // updatedAt
    );
  }

  public User updateProfile(Integer id, UserDTO.ProfileDTO update) {
    var user = findById(id);

    user = User.builder()
               .id(user.getId())
               .fullName(update.getFullName())
               .email(update.getEmail())
               .avatarUrl(user.getAvatarUrl())
               .phoneNumber(update.getPhoneNumber())
               .createdBy(user.getCreatedBy())
               .createdAt(user.getCreatedAt())
               .updatedBy(authService.getAuthLogin())
               .updatedAt(LocalDateTime.now())
               .status(user.getStatus())
               .build();

    if (update.getPassword() != null && !update.getPassword().isEmpty()) {
      user.setPassword(passwordEncoder.encode(update.getPassword()));
    } else {
      user.setPassword(user.getPassword());
    }

    if (update.getAvatarUrl() != null && !update.getAvatarUrl().isEmpty()) {
      String fileName = storageFileService.uploadUserImg(update.getAvatarUrl());
      user.setAvatarUrl(fileName);
    } else {
      user.setAvatarUrl(user.getAvatarUrl());
    }

    return repository.save(user);
  }
//  @Override
//  protected void beforeDelete(Integer id) {
//    updateMapURIfUserDelete(id, getAuthId());
//  }
//
//
//  private void updateMapURIfUserDelete(int userId, int authId) {
//    List<MapUserRoles> mapUserRolesList = mapUserRoleRepository.findAllByUserId(userId);
//
//    List<Integer> mapURIds = mapUserRolesList.stream()
//                                             .map(MapUserRoles::getId)
//                                             .toList();
//
//    updatePermissionIfUserDelete(mapURIds, authId);
//
//    for (MapUserRoles mapUserRoles : mapUserRolesList) {
//      mapUserRoles.setDeletedAt(LocalDateTime.now());
//      mapUserRoles.setUpdatedBy(authId);
//      mapUserRoleRepository.save(mapUserRoles);
//    }
//  }
//
//  private void updatePermissionIfUserDelete(Collection<Integer> mapUserRoleId, int authId) {

  /// /    List<Permissions> findAllPermissions = permissionsRepository.findAllByMapURId(mapUserRoleId);
//    List<Permissions> findAllPermissions = null;
//
//    for (Permissions permission : findAllPermissions) {
//      permission.setDeletedAt(LocalDateTime.now());
//      permission.setUpdatedBy(authId);
//      permissionsRepository.save(permission);
//    }
//  }
  @Transactional
  public boolean existsByEmail(String email) {
    return repository.existsByEmail(email);
  }

  @Transactional
  public void changePassword(String email, String newPassword) {
    var user = repository.findByEmail(email).orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND, "User"));
    user.setPassword(passwordEncoder.encode(newPassword));
    repository.save(user);
  }


  @Override
  protected RuntimeException createNotFoundException(Integer integer) {
    return new AppException(ErrorCode.NOT_FOUND, "User");
  }
}
