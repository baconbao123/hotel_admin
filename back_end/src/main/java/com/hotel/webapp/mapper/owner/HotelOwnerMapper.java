package com.hotel.webapp.mapper.owner;

import com.hotel.webapp.base.BaseMapper;
import com.hotel.webapp.dto.request.owner.HotelOwnerDTO;
import com.hotel.webapp.entity.Hotels;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface HotelOwnerMapper extends BaseMapper<Hotels, HotelOwnerDTO> {
  @Override
  @Mapping(target = "ownerId", ignore = true)
  @Mapping(target = "avatar", ignore = true)
  @Mapping(target = "addressId", ignore = true)
  @Mapping(target = "policyId", ignore = true)
  @Mapping(target = "approveId", ignore = true)
  @Mapping(target = "note", ignore = true)
  Hotels toCreate(HotelOwnerDTO create);

  @Override
  @Mapping(target = "ownerId", ignore = true)
  @Mapping(target = "avatar", ignore = true)
  @Mapping(target = "addressId", ignore = true)
  @Mapping(target = "policyId", ignore = true)
  @Mapping(target = "approveId", ignore = true)
  @Mapping(target = "note", ignore = true)
  void toUpdate(@MappingTarget Hotels target, HotelOwnerDTO update);
}
