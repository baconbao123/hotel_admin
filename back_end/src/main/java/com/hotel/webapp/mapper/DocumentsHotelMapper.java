package com.hotel.webapp.mapper;

import com.hotel.webapp.base.BaseMapper;
import com.hotel.webapp.dto.request.DocumentsHotelDTO;
import com.hotel.webapp.entity.DocumentsHotel;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface DocumentsHotelMapper extends BaseMapper<DocumentsHotel, DocumentsHotelDTO> {
  @Override
  @Mapping(target = "documentUrl", ignore = true)
  DocumentsHotel toCreate(DocumentsHotelDTO create);

  @Override
  @Mapping(target = "documentUrl", ignore = true)
  void toUpdate(@MappingTarget DocumentsHotel target, DocumentsHotelDTO update);
}
