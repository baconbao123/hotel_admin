package com.hotel.webapp.mapper.admin;

import com.hotel.webapp.base.BaseMapper;
import com.hotel.webapp.dto.admin.request.StreetDTO;
import com.hotel.webapp.entity.Streets;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface StreetMapper extends BaseMapper<Streets, StreetDTO> {
}
