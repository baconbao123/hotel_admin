package com.hotel.webapp.mapper.admin;

import com.hotel.webapp.base.BaseMapper;
import com.hotel.webapp.dto.admin.request.NameDTO;
import com.hotel.webapp.entity.DocumentType;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface DocumentTypeMapper extends BaseMapper<DocumentType, NameDTO> {
}
