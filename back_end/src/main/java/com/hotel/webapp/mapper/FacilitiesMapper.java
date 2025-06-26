package com.hotel.webapp.mapper;

import com.hotel.webapp.base.BaseMapper;
import com.hotel.webapp.dto.request.FacilitiesDTO;
import com.hotel.webapp.entity.Facilities;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface FacilitiesMapper extends BaseMapper<Facilities, FacilitiesDTO> {
  @Override
  @Mapping(target = "icon", ignore = true)
  Facilities toCreate(FacilitiesDTO create);

  @Override
  @Mapping(target = "icon", ignore = true)
  void toUpdate(@MappingTarget Facilities target, FacilitiesDTO update);
}
