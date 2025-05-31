package com.hotel.webapp.mapper;

import com.hotel.webapp.base.BaseMapper;
import com.hotel.webapp.dto.request.AddressDTO;
import com.hotel.webapp.entity.Address;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface AddressMapper extends BaseMapper<Address, AddressDTO> {
}
