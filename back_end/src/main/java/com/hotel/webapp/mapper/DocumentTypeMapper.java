package com.hotel.webapp.mapper;

import com.hotel.webapp.base.BaseMapper;
import com.hotel.webapp.dto.request.NameDTO;
import com.hotel.webapp.entity.DocumentType;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface DocumentTypeMapper extends BaseMapper<DocumentType, NameDTO> {
}
