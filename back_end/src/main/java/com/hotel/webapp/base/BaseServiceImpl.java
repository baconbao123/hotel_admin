package com.hotel.webapp.base;

import com.hotel.webapp.exception.AppException;
import com.hotel.webapp.exception.ErrorCode;
import com.hotel.webapp.service.admin.interfaces.AuthService;
import jakarta.persistence.criteria.Predicate;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;

@Transactional
@FieldDefaults(level = AccessLevel.PROTECTED, makeFinal = true)
public abstract class BaseServiceImpl<E, ID, DTO, R extends BaseRepository<E, ID>> implements BaseService<E, ID, DTO> {
  R repository;
  BaseMapper<E, DTO> mapper;
  AuthService authService; // get authId

  public BaseServiceImpl(R repository, BaseMapper<E, DTO> mapper, AuthService authService) {
    this.repository = repository;
    this.mapper = mapper;
    this.authService = authService;
  }

  public BaseServiceImpl(R repository, AuthService authService) {
    this(repository, null, authService);
  }

  private static String convertDateToString(Object value) {
    if (value instanceof LocalDate localDate) {
      return localDate.format(DateTimeFormatter.ISO_LOCAL_DATE);
    }

    return value.toString();
  }

  private static Object parseNumber(String value, Class<?> targetType) {
    if (targetType.equals(Integer.class) || targetType.equals(int.class)) {
      return Integer.parseInt(value);
    } else if (targetType.equals(Long.class) || targetType.equals(long.class)) {
      return Long.parseLong(value);
    }
    return value;
  }

  private <E> Specification<E> buildSpecification(Map<String, Object> filters) {
    return (root, query, cb) -> {
      List<Predicate> predicates = new ArrayList<>();

      if (filters != null) {
        for (Map.Entry<String, Object> entry : filters.entrySet()) {
          String fieldName = entry.getKey();
          Object value = entry.getValue();

          if (fieldName != null && !fieldName.trim().isEmpty() && value != null && !value.toString().trim().isEmpty()) {
            String searchValue = convertDateToString(value).toLowerCase();
            Class<?> fieldType = root.get(fieldName).getJavaType();

            if (fieldType.equals(LocalDate.class)) {
              predicates.add(
                    cb.equal(root.get(fieldName), LocalDate.parse(searchValue, DateTimeFormatter.ISO_LOCAL_DATE)));
            } else if (fieldType.equals(Boolean.class)) {
              predicates.add(cb.equal(root.get(fieldName), Boolean.parseBoolean(searchValue)));
            } else if (fieldType.equals(Integer.class) || fieldType.equals(int.class)
                  || fieldType.equals(Long.class) || fieldType.equals(long.class)) {
              predicates.add(cb.equal(root.get(fieldName), parseNumber(searchValue, fieldType)));
            } else {
              predicates.add(cb.like(cb.lower(root.get(fieldName).as(String.class)), "%" + searchValue + "%"));
            }
          }
        }
      }

      return predicates.isEmpty() ? cb.conjunction() : cb.and(predicates.toArray(new Predicate[0]));
    };
  }

  @Override
  public Page<E> getAll(Map<String, Object> filters, String sort) {
    Specification<E> spec = buildSpecification(filters);
    Pageable defaultPage = buildPageable(sort);
    return repository.findAll(spec, defaultPage);
  }

  private Pageable buildPageable(String sort) {
    int page = 0;
    int size = 30;

    if (sort == null || sort.trim().isEmpty()) {
      return PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));
    }

    Sort.Direction direction = sort.toLowerCase().equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC;

    return PageRequest.of(page, size, Sort.by(direction, "createdAt"));
  }

  @Override
  public E create(DTO create) {
    validateDTOCommon(create);
    validateCreate(create);
    E entity = mapper.toCreate(create);

    if (entity instanceof AuditEntity audit) {
      audit.setCreatedAt(LocalDateTime.now());
      audit.setCreatedBy(getAuthId());
    }

    entity = repository.save(entity);

    afterCreate(entity, create);
    return entity;
  }

  @Override
  public E update(ID id, DTO update) {

    validateDTOCommon(update);

    E entity = getById(id);
    validateUpdate((Integer) id, update);
    mapper.toUpdate(entity, update);

    if (entity instanceof AuditEntity audit) {
      audit.setUpdatedAt(LocalDateTime.now());
      audit.setUpdatedBy(getAuthId());
    }

    afterUpdate(entity, update);

    return repository.save(entity);
  }


  @Override
  public void delete(ID id) {
    E entity = getById(id);
    validateDelete(id);

    beforeDelete(id);

    if (entity instanceof AuditEntity audit) {
      audit.setDeletedAt(LocalDateTime.now());
      repository.save(entity);
    }
  }

  @Override
  public E getById(ID id) {
    return repository.findById(id)
                     .filter(e -> !(e instanceof AuditEntity audit) || audit.getDeletedAt() == null)
                     .orElseThrow(() -> createNotFoundException(id));
  }


  protected Integer getAuthId() {
    Integer authId = authService.getAuthLogin();
    if (authId == null) {
      throw new AppException(ErrorCode.ACCESS_DENIED);
    }
    return authId;
  }

  public Collection<E> createCollectionBulk(DTO dto) {
    throw new RuntimeException("Not implemented yet");
  }

  public Collection<E> updateCollectionBulk(ID id, DTO dto) {
    throw new RuntimeException("Not implemented yet");
  }

  protected void validateCreate(DTO create) {
  }

  protected void validateUpdate(Integer id, DTO update) {
  }

  protected void validateDelete(ID id) {
  }

  protected void validateDTOCommon(DTO dto) {
  }

  protected abstract RuntimeException createNotFoundException(ID id);


  protected void afterCreate(E entity, DTO dto) {
  }

  protected void afterUpdate(E entity, DTO dto) {
  }

  protected void beforeDelete(ID id) {
  }
}