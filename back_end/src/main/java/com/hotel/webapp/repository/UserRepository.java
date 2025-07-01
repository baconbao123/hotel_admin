package com.hotel.webapp.repository;

import com.hotel.webapp.base.BaseRepository;
import com.hotel.webapp.entity.User;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
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
  Optional<User> findByRefreshToken(String refreshToken);

  @Query("select u.id, u.fullName, u.email, u.phoneNumber, u.avatarUrl, u.status, " +
        "u1.fullName, u2.fullName, u.createdAt, u.updatedAt, ut.id, ut.name " +
        "from User u " +
        "left join UserType ut on u.userType = ut.id " +
        "left join User u1 on u.createdBy = u1.id " +
        "left join User u2 on u.updatedBy = u2.id " +
        "where u.id = :id")
  List<Object[]> getUserById(Integer id);

  @Query("SELECT r.id, r.name " +
        "FROM Role r " +
        "LEFT JOIN MapUserRoles mur ON mur.roleId = r.id " +
        "WHERE mur.userId = :userId and r.deletedAt IS NULL and mur.deletedAt is null")
  List<Object[]> getRolesByUserId(Integer userId);

  @Query("select u.id, u.fullName, u.email " +
        "from User u " +
        "join MapUserRoles mur on u.id = mur.userId " +
        "join Role r on mur.roleId = r.id " +
        "where lower(r.name) = 'owner' " +
        "and (:keyword is null or lower(u.fullName) like lower(concat('%', :keyword, '%')))" +
        "and mur.deletedAt is null and r.deletedAt is null")
  List<Object[]> findOwners(@Param("keyword") String keyword, Pageable pageable);
}
