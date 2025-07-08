package com.hotel.webapp.service.admin;

import com.hotel.webapp.base.BaseServiceImpl;
import com.hotel.webapp.dto.request.UserDTO;
import com.hotel.webapp.dto.response.UserRes;
import com.hotel.webapp.entity.MapUserRoles;
import com.hotel.webapp.entity.Role;
import com.hotel.webapp.entity.User;
import com.hotel.webapp.entity.UserType;
import com.hotel.webapp.exception.AppException;
import com.hotel.webapp.exception.ErrorCode;
import com.hotel.webapp.repository.MapUserRoleRepository;
import com.hotel.webapp.repository.RoleRepository;
import com.hotel.webapp.repository.UserRepository;
import com.hotel.webapp.repository.seeder.UserTypeRepository;
import com.hotel.webapp.service.admin.interfaces.AuthService;
import com.hotel.webapp.service.system.StorageFileService;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Slf4j
@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserService extends BaseServiceImpl<User, Integer, UserDTO, UserRepository> {
  MapUserRoleRepository mapUserRoleRepository;
  StorageFileService storageFileService;
  PasswordEncoder passwordEncoder;
  MapUserRoleRepository userRoleRepository;
  RoleRepository roleRepository;
  UserTypeRepository userTypeRepository;

  public UserService(
        UserRepository repository,
        AuthService authService,
        MapUserRoleRepository mapUserRoleRepository,
        StorageFileService storageFileService,
        PasswordEncoder passwordEncoder,
        MapUserRoleRepository userRoleRepository,
        RoleRepository roleRepository,
        UserTypeRepository userTypeRepository
  ) {
    super(repository, null, authService);
    this.mapUserRoleRepository = mapUserRoleRepository;
    this.storageFileService = storageFileService;
    this.passwordEncoder = passwordEncoder;
    this.userRoleRepository = userRoleRepository;
    this.roleRepository = roleRepository;
    this.userTypeRepository = userTypeRepository;
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
                   .password(passwordEncoder.encode(create.getPassword()))
                   .userType(create.getUserTypeId())
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

    user.setUserType(user.getUserType());
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

  public User updateUser(Integer id, UserDTO.UserUpdateDTO update) {
    var user = findById(id);

    // valid
    if (repository.existsByEmailAndIdNot(update.getEmail(), id))
      throw new AppException(ErrorCode.FIELD_EXISTED, "Email");

    user = User.builder()
               .id(user.getId())
               .fullName(update.getFullName())
               .email(update.getEmail())
               .password(user.getPassword())
               .userType(update.getUserTypeId())
               .avatarUrl(user.getAvatarUrl())
               .phoneNumber(update.getPhoneNumber())
               .createdBy(user.getCreatedBy())
               .createdAt(user.getCreatedAt())
               .updatedBy(authService.getAuthLogin())
               .updatedAt(LocalDateTime.now())
               .status(update.getStatus())
               .build();

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

  // find-all owner id
  public List<UserRes.OwnerRes> findOwner(String keyWord, int page) {
    Pageable defaultPage = PageRequest.of(page, 20);
    List<Object[]> ownerObjs = repository.findOwners(keyWord, defaultPage);
    return ownerObjs.stream()
                    .map(o -> new UserRes.OwnerRes((Integer) o[0], (String) o[1], (String) o[2]))
                    .toList();
  }

  // find by id
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
          (LocalDateTime) userObj[9], // updatedAt
          (Integer) userObj[10],
          (String) userObj[11]
    );
  }

  // Update Profile
  public User updateProfile(Integer id, UserDTO.ProfileDTO update) {
    var user = findById(id);

    if (repository.existsByEmailAndIdNot(update.getEmail(), id))
      throw new AppException(ErrorCode.FIELD_EXISTED, "Email");

    user = User.builder()
               .id(user.getId())
               .fullName(update.getFullName())
               .email(update.getEmail())
               .password(user.getPassword())
               .avatarUrl(user.getAvatarUrl())
               .phoneNumber(update.getPhoneNumber())
               .createdBy(user.getCreatedBy())
               .createdAt(user.getCreatedAt())
               .updatedBy(authService.getAuthLogin())
               .updatedAt(LocalDateTime.now())
               .status(user.getStatus())
               .build();

    if (update.getAvatarUrl() != null && !update.getAvatarUrl().isEmpty()) {
      String fileName = storageFileService.uploadUserImg(update.getAvatarUrl());
      user.setAvatarUrl(fileName);
    } else {
      user.setAvatarUrl(user.getAvatarUrl());
    }

    return repository.save(user);
  }

  // find profile
  public UserRes.UserProfileRes findProfile() {
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    var username = auth.getName();

    User user = repository.findByEmail(username)
                          .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND, "Not Found Profile"));

    var userRoles = userRoleRepository.findAllByUserIdAndDeletedAtIsNull(user.getId());


    List<String> roles = userRoles.stream()
                                  .map(ur -> roleRepository.findRolesByDeletedAtIsNull(ur.getRoleId())
                                                           .orElseThrow(() -> new AppException(ErrorCode.COMMON_400,
                                                                 "Something went wrong with account")))
                                  .map(Role::getName)
                                  .toList();

    return new UserRes.UserProfileRes(
          user.getId(),
          user.getFullName(),
          user.getEmail(),
          user.getPhoneNumber(),
          user.getAvatarUrl(),
          roles
    );
  }

  public UserRes.UserFEProfileRes findUserProfile() {
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    var username = auth.getName();

    User user = repository.findByEmail(username)
                          .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND, "Not Found Profile"));


    return new UserRes.UserFEProfileRes(
          user.getId(),
          user.getFullName(),
          user.getEmail(),
          user.getPhoneNumber(),
          user.getAvatarUrl()
    );
  }

  // check email already existed
  @Transactional
  public boolean existsByEmail(String email) {
    return repository.existsByEmail(email);
  }

  // change password - admin
  @Transactional
  public void changePassword(String email, String newPassword) {
    var user = repository.findByEmail(email).orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND, "User"));
    user.setPassword(passwordEncoder.encode(newPassword));
    repository.save(user);
  }

  // check match password
  public boolean matchPassword(String email, String oldPassword) {
    var user = repository.findByEmail(email)
                         .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND, "User"));

    return passwordEncoder.matches(oldPassword, user.getPassword());
  }

  // find user type
  public List<UserType> findUserTypes() {
    return userTypeRepository.findUserTypes();
  }


  @Override
  protected RuntimeException createNotFoundException(Integer integer) {
    return new AppException(ErrorCode.NOT_FOUND, "User");
  }
}
