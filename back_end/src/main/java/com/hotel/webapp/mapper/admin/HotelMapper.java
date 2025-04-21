package com.hotel.webapp.mapper.admin;

import com.hotel.webapp.base.BaseMapper;
import com.hotel.webapp.dto.admin.request.HotelDTO;
import com.hotel.webapp.entity.Hotels;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface HotelMapper extends BaseMapper<Hotels, HotelDTO> {
}
