package com.hotel.webapp.mapper.admin;

import com.hotel.webapp.base.BaseMapper;
import com.hotel.webapp.dto.admin.request.HotelPolicyDTO;
import com.hotel.webapp.entity.HotelPolicy;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface HotelPolicyMapper extends BaseMapper<HotelPolicy, HotelPolicyDTO> {
}
