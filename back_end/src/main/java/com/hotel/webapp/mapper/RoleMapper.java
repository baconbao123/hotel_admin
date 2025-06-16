package com.hotel.webapp.mapper;

import com.hotel.webapp.base.BaseMapper;
import com.hotel.webapp.dto.request.RoleDTO;
import com.hotel.webapp.dto.request.StreetsDTO;
import com.hotel.webapp.entity.Role;
import com.hotel.webapp.entity.Streets;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface RoleMapper extends BaseMapper<Role, RoleDTO> {
}

