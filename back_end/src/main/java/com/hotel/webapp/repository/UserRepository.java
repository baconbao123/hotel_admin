package com.hotel.webapp.repository;

import com.hotel.webapp.base.BaseRepository;
import com.hotel.webapp.entity.User;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends BaseRepository<User, Integer> {
  //  Startup - for sa
  Optional<User> findByEmail(String email);

  boolean existsByEmail(String email);

  boolean existsByEmailAndIdNot(String email, int id);

  // ----------------------
  boolean existsByIdAndDeletedAtIsNull(Integer id);

  Optional<User> findByRefreshToken(String refreshToken);

  @Query("select u.id, u.fullName, u.email, u.phoneNumber, u.avatarUrl, u.status, " +
        "u1.fullName, u2.fullName, u.createdAt, u.updatedAt " +
        "from User u " +
        "left join User u1 on u.createdBy = u1.id " +
        "left join User u2 on u.updatedBy = u2.id " +
        "where u.id = :id")
  List<Object[]> getUserById(Integer id);

  @Query("SELECT r.id, r.name " +
        "FROM Role r " +
        "LEFT JOIN MapUserRoles mur ON mur.roleId = r.id " +
        "WHERE mur.userId = :userId and r.deletedAt IS NULL and mur.deletedAt is null")
  List<Object[]> getRolesByUserId(Integer userId);
}
