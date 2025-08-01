package com.hotel.webapp.config;

import com.hotel.webapp.entity.MapUserRoles;
import com.hotel.webapp.entity.Permissions;
import com.hotel.webapp.entity.Role;
import com.hotel.webapp.entity.User;
import com.hotel.webapp.repository.MapUserRoleRepository;
import com.hotel.webapp.repository.PermissionsRepository;
import com.hotel.webapp.repository.RoleRepository;
import com.hotel.webapp.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;

@Configuration
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ApplicationInitConfig {
  PasswordEncoder passwordEncoder;

  @Bean
  ApplicationRunner applicationRunner(UserRepository userRepository, RoleRepository roleRepository,
        MapUserRoleRepository mapUserRoleRepository, PermissionsRepository permissionsRepository) {
    return args -> {
      User user = userRepository.findByEmail("sa@gmail.com")
                                .orElseGet(() -> {
                                  User newUser = User.builder()
                                                     .fullName("sa")
                                                     .email("sa@gmail.com")
                                                     .password(passwordEncoder.encode("123"))
                                                     .phoneNumber("")
                                                     .createdAt(LocalDateTime.now())
                                                     .build();
                                  return userRepository.save(newUser);
                                });

      Role role = roleRepository.findByName("Admin")
                                .orElseGet(() -> {
                                  Role newRole = Role.builder().name("Admin")
                                                     .status(true)
                                                     .createdAt(LocalDateTime.now())
                                                     .build();
                                  return roleRepository.save(newRole);
                                });

      permissionsRepository.findByRoleId(role.getId())
                           .orElseGet(() -> {
                             Permissions newPermission = Permissions.builder()
                                                                    .roleId(role.getId())
                                                                    .createdAt(
                                                                          LocalDateTime.now())
                                                                    .build();
                             return permissionsRepository.save(newPermission);
                           });

      if (mapUserRoleRepository.findByRoleIdAndUserId(role.getId(), user.getId()).isEmpty()) {
        MapUserRoles userRole = MapUserRoles.builder()
                                            .roleId(role.getId())
                                            .userId(user.getId())
                                            .build();
        mapUserRoleRepository.save(userRole);
      }

    };
  }
}
