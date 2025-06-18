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

  boolean existsByIdAndStatusIsTrueAndDeletedAtIsNull(Integer id);

  // ----------------------
  boolean existsByIdAndDeletedAtIsNull(Integer id);

  Optional<User> findByRefreshToken(String refreshToken);

  @Query("select u.id, u.fullName, u.email, u.phoneNumber, u.avatarUrl, u.status, " +
        "a.streetNumber, a.streetId, a.wardCode, w.name, a.districtCode, d.name, a.provinceCode, p.name, s.name, " +
        "a.note, u1.fullName, u2.fullName, u.createdAt, u.updatedAt " +
        "from User u " +
        "left join User u1 on u.createdBy = u1.id " +
        "left join User u2 on u.updatedBy = u2.id " +
        "join Address a on u.addressId = a.id " +
        "join Provinces p on a.provinceCode = p.code " +
        "join Wards w on a.wardCode = w.code " +
        "join Districts d on a.districtCode = d.code " +
        "join Streets s on a.streetId = s.id " +
        "where u.id = :id")
  List<Object[]> getUserById(Integer id);

  @Query("select r.id, r.name " +
        "from Role r " +
        "left join MapUserRoles mur on mur.roleId = r.id and mur.userId = :userId " +
        "where mur.userId = :userId and mur.deletedAt is null")
  List<Object[]> getRolesByUserId(Integer userId);
}
