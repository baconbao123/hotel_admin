package com.hotel.webapp.mapper;

import com.hotel.webapp.base.BaseMapper;
import com.hotel.webapp.dto.request.FacilitiesDTO;
import com.hotel.webapp.entity.Facilities;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface FacilitiesMapper extends BaseMapper<Facilities, FacilitiesDTO> {
}
