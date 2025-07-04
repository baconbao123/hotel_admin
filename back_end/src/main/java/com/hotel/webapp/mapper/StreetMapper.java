package com.hotel.webapp.mapper;

import com.hotel.webapp.base.BaseMapper;
import com.hotel.webapp.dto.request.StreetsDTO;
import com.hotel.webapp.entity.Streets;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface StreetMapper extends BaseMapper<Streets, StreetsDTO> {
}
