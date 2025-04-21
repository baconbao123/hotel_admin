package com.hotel.webapp.mapper.admin;

import com.hotel.webapp.base.BaseMapper;
import com.hotel.webapp.dto.admin.request.FacilitiesDTO;
import com.hotel.webapp.dto.admin.request.NameDTO;
import com.hotel.webapp.entity.Facilities;
import com.hotel.webapp.entity.FacilityType;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface FacilitiesMapper extends BaseMapper<Facilities, FacilitiesDTO> {
}
