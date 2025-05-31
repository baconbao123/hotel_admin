package com.hotel.webapp.mapper;

import com.hotel.webapp.base.BaseMapper;
import com.hotel.webapp.dto.request.NameDTO;
import com.hotel.webapp.entity.FacilityType;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface FacilityTypeMapper extends BaseMapper<FacilityType, NameDTO> {
}
