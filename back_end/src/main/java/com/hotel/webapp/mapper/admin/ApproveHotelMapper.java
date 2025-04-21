package com.hotel.webapp.mapper.admin;

import com.hotel.webapp.base.BaseMapper;
import com.hotel.webapp.dto.admin.request.ApproveHotelDTO;
import com.hotel.webapp.entity.ApproveHotel;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ApproveHotelMapper extends BaseMapper<ApproveHotel, ApproveHotelDTO> {
}
