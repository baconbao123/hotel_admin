package com.hotel.webapp.repository;

import com.hotel.webapp.base.BaseRepository;
import com.hotel.webapp.entity.User;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends BaseRepository<User, Integer> {
  //  Startup - for sa
  Optional<User> findByEmail(String email);

  boolean existsByEmailAndDeletedAtIsNull(String email);

  boolean existsByEmailAndIdNotAndDeletedAtIsNull(String email, int id);

  boolean existsByIdAndIsActiveIsTrueAndDeletedAtIsNull(Integer id);


  // ----------------------
  boolean existsByIdAndDeletedAtIsNull(Integer id);

  @Query("SELECT u FROM User u WHERE u.deletedAt IS NULL AND lower(u.email) like lower(concat('%', :email, '%')) " +
        "AND u.email <> 'sa@gmail.com'")
  List<User> findAllByEmail(@Param("email") String email);

  Optional<User> findByRefreshToken(String refreshToken);
}
