package com.hotel.webapp.mapper;

import com.hotel.webapp.base.BaseMapper;
import com.hotel.webapp.dto.request.HotelPolicyDTO;
import com.hotel.webapp.entity.HotelPolicy;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface HotelPolicyMapper extends BaseMapper<HotelPolicy, HotelPolicyDTO> {
}
