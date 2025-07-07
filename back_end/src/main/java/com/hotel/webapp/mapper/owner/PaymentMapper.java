package com.hotel.webapp.mapper.owner;

import com.hotel.webapp.base.BaseMapper;
import com.hotel.webapp.dto.request.owner.PaymentDTO;
import com.hotel.webapp.entity.Payment;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface PaymentMapper extends BaseMapper<Payment, PaymentDTO> {
}
