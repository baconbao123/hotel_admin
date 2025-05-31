package com.hotel.webapp.base;

import org.springframework.data.domain.Page;

import java.util.Map;

public interface BaseService<E, ID, DTO> {
  E create(DTO create);

  E update(ID id, DTO update);

  void delete(ID id);

  E getById(ID id);

  Page<E> getAll(Map<String, Object> filters, String sort);
}
