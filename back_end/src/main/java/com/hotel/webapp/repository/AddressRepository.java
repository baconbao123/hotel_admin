package com.hotel.webapp.repository;

import com.hotel.webapp.base.BaseRepository;
import com.hotel.webapp.dto.user_response.AddressRes;
import com.hotel.webapp.entity.Address;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AddressRepository extends BaseRepository<Address, Integer> {
  Optional<Address> findByIdAndDeletedAtIsNull(Integer id);

  // for user
  List<Address> findByIdInAndDeletedAtIsNull(List<Integer> ids);

  @Query("select new " +
        "com.hotel.webapp.dto.user_response.AddressRes(a.streetNumber, s.name, p.name, d.name, w.name, a.note)" +
        "from Address a " +
        "join Provinces p on a.provinceCode = p.code " +
        "join Districts d on a.districtCode = d.code " +
        "join Streets s on a.streetId = s.id " +
        "join Wards w on a.wardCode = w.code " +
        "where a.id = :addressId and a.deletedAt is null")
  AddressRes findAddressDetail(Integer addressId);
}
